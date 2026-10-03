import logging
import uuid

from django.conf import settings
from django.db.models import F
from django.http import Http404, HttpResponseNotFound
from django.shortcuts import redirect
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.links.models import ShortLink
from apps.tracking.parsers import RequestMetadataExtractor
from apps.tracking.services import ClickTrackingService

logger = logging.getLogger("linkpulse")


def render_error_html(request, title: str, message: str, short_code: str, status_tag: str):
    """
    Renders a clean, branded HTML error notice when short links are expired,
    disabled, or non-existent (e.g. when visited via browser or QR code scanner).
    """
    accept_header = request.headers.get("Accept", "")
    # If explicit JSON client (like API test without HTML accept), fall back to DRF Http404
    if "application/json" in accept_header and "text/html" not in accept_header:
        raise Http404(message)

    frontend_url = getattr(settings, "FRONTEND_URL", "https://linkpulse-analyzer.vercel.app")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — LinkPulse</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}
        body {{
            background-color: #FFFFFF;
            color: #141414;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }}
        .card {{
            width: 100%;
            max-width: 520px;
            border: 2px solid #141414;
            background-color: #FFFFFF;
            padding: 36px;
            box-shadow: 6px 6px 0px 0px #141414;
        }}
        .header {{
            display: flex;
            align-items: center;
            gap: 16px;
            padding-bottom: 20px;
            border-bottom: 1px solid #141414;
            margin-bottom: 24px;
        }}
        .badge {{
            width: 44px;
            height: 44px;
            background-color: #B91C1C;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 22px;
            flex-shrink: 0;
        }}
        .system-tag {{
            font-family: monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.12em;
            color: #7A7A7A;
            text-transform: uppercase;
            display: block;
            margin-bottom: 4px;
        }}
        .title {{
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            color: #141414;
            line-height: 1.1;
        }}
        .message {{
            font-size: 15px;
            font-weight: 500;
            color: #444343;
            line-height: 1.6;
            margin-bottom: 24px;
        }}
        .code-box {{
            border: 1px solid #C7C7C7;
            background-color: #F8F9FA;
            padding: 14px 18px;
            font-family: monospace;
            font-size: 12px;
            color: #141414;
            margin-bottom: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .code-box span {{
            color: #7A7A7A;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 52px;
            background-color: #1351AA;
            color: #FFFFFF;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-decoration: none;
            border: 1px solid #1351AA;
            transition: background-color 0.2s ease;
        }}
        .btn:hover {{
            background-color: #141414;
            border-color: #141414;
        }}
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div class="badge">!</div>
            <div>
                <span class="system-tag">LINKPULSE / {status_tag}</span>
                <h1 class="title">{title}</h1>
            </div>
        </div>
        <p class="message">{message}</p>
        <div class="code-box">
            <div>
                <span>LINK PATH: </span>
                <strong>/{short_code}</strong>
            </div>
            <div>
                <span>STATUS: </span>
                <strong style="color: #B91C1C;">{status_tag}</strong>
            </div>
        </div>
        <a href="{frontend_url}" class="btn">GO TO LINKPULSE &rarr;</a>
    </div>
</body>
</html>"""
    return HttpResponseNotFound(html_content, content_type="text/html")


class RedirectView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        summary="Redirect short code to original URL",
        responses={302: None, 404: None},
    )
    def get(self, request, short_code):
        try:
            link = ShortLink.objects.select_related("workspace").get(
                short_code=short_code
            )
        except ShortLink.DoesNotExist:
            return render_error_html(
                request,
                title="LINK NOT FOUND",
                message="The short link you are trying to visit does not exist or has been removed.",
                short_code=short_code,
                status_tag="NOT FOUND",
            )

        # Check if disabled
        if not link.is_active:
            return render_error_html(
                request,
                title="LINK DISABLED",
                message="This short link has been disabled by its creator and is not taking traffic.",
                short_code=short_code,
                status_tag="DISABLED",
            )

        # Check if expired
        if link.is_expired:
            return render_error_html(
                request,
                title="LINK EXPIRED",
                message="This short link has expired and is no longer active.",
                short_code=short_code,
                status_tag="EXPIRED",
            )

        # Extract visitor ID
        visitor_id = ClickTrackingService.get_or_create_visitor_id(request)

        # Extract request metadata and assign unique event_id for Celery task idempotency
        metadata = RequestMetadataExtractor.extract(request)
        metadata["visitor_id"] = visitor_id
        metadata["event_id"] = str(uuid.uuid4())

        # Fast lightweight counter increment (Section 37)
        ShortLink.objects.filter(pk=link.pk).update(click_count=F("click_count") + 1)

        # Queue async click event (Section 20)
        ClickTrackingService.record_click(link, metadata)

        # Redirect immediately with HTTP 302
        response = redirect(link.original_url, permanent=False)

        # Set visitor cookie if not present
        if "lp_vid" not in request.COOKIES:
            response.set_cookie(
                "lp_vid",
                visitor_id,
                max_age=365 * 24 * 60 * 60,  # 1 year
                httponly=True,
                samesite="Lax",
            )

        return response
