import logging

from django.db.models import F
from django.http import Http404
from django.shortcuts import redirect
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.links.models import ShortLink
from apps.tracking.parsers import RequestMetadataExtractor
from apps.tracking.services import ClickTrackingService

logger = logging.getLogger("linkpulse")


class RedirectView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        summary="Redirect short code to original URL",
        responses={302: None, 404: None},
    )
    def get(self, request, short_code):
        import uuid

        try:
            link = ShortLink.objects.select_related("workspace").get(
                short_code=short_code
            )
        except ShortLink.DoesNotExist as e:
            raise Http404("Short link not found.") from e

        # Check if disabled
        if not link.is_active:
            raise Http404("Short link is disabled.")

        # Check if expired
        if link.is_expired:
            raise Http404("Short link has expired.")

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
