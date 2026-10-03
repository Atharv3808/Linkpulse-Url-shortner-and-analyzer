import csv

from django.http import HttpResponse
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import permissions, views
from rest_framework.response import Response

from apps.analytics.services import AnalyticsService
from apps.common.exceptions import InvalidShortCode, WorkspaceAccessDenied
from apps.links.models import ShortLink
from apps.tracking.models import ClickEvent
from apps.workspaces.models import WorkspaceMember


class OverviewAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                "workspace_id", description="Filter overview by workspace UUID"
            )
        ],
        summary="Get overall analytics overview for user or workspace",
    )
    def get(self, request):
        workspace_id = request.query_params.get("workspace_id")
        data = AnalyticsService.get_overview(request.user, workspace_id=workspace_id)
        return Response({"success": True, "data": data})


class LinkAnalyticsBaseView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_link(self, link_id, user):
        try:
            link = ShortLink.objects.select_related("workspace").get(id=link_id)
        except ShortLink.DoesNotExist as e:
            raise InvalidShortCode("Short link not found.") from e

        if not WorkspaceMember.objects.filter(
            workspace=link.workspace, user=user
        ).exists():
            raise WorkspaceAccessDenied(
                "You do not have access to this link's workspace."
            )

        return link


class LinkAnalyticsDetailView(LinkAnalyticsBaseView):
    @extend_schema(
        parameters=[
            OpenApiParameter(
                "range", description="Time range (today, 24h, 7d, 30d, 90d)"
            )
        ],
        summary="Get complete analytics breakdown for a specific short link",
    )
    def get(self, request, link_id):
        link = self.get_link(link_id, request.user)
        range_param = request.query_params.get("range", "30d")
        domain = request.build_absolute_uri("/").rstrip("/")
        data = AnalyticsService.get_full_link_analytics(
            link, range_param=range_param, domain=domain
        )
        return Response({"success": True, "data": data})


class LinkTimelineView(LinkAnalyticsBaseView):
    @extend_schema(
        parameters=[
            OpenApiParameter(
                "range", description="Time range (today, 24h, 7d, 30d, 90d)"
            )
        ],
        summary="Get time-series click timeline for a short link",
    )
    def get(self, request, link_id):
        link = self.get_link(link_id, request.user)
        range_param = request.query_params.get("range", "30d")
        timeline = AnalyticsService.get_timeline(link, range_param=range_param)
        return Response({"success": True, "data": timeline})


class LinkCountriesView(LinkAnalyticsBaseView):
    @extend_schema(summary="Get geographic country breakdown for a short link")
    def get(self, request, link_id):
        link = self.get_link(link_id, request.user)
        range_param = request.query_params.get("range", "30d")
        data = AnalyticsService.get_countries(link, range_param=range_param)
        return Response({"success": True, "data": data})


class LinkDevicesView(LinkAnalyticsBaseView):
    @extend_schema(summary="Get device type breakdown for a short link")
    def get(self, request, link_id):
        link = self.get_link(link_id, request.user)
        range_param = request.query_params.get("range", "30d")
        data = AnalyticsService.get_devices(link, range_param=range_param)
        return Response({"success": True, "data": data})


class LinkReferrersView(LinkAnalyticsBaseView):
    @extend_schema(summary="Get referrer domain breakdown for a short link")
    def get(self, request, link_id):
        link = self.get_link(link_id, request.user)
        range_param = request.query_params.get("range", "30d")
        data = AnalyticsService.get_referrers(link, range_param=range_param)
        return Response({"success": True, "data": data})


class LinkExportView(LinkAnalyticsBaseView):
    @extend_schema(summary="Export click events for a short link as CSV")
    def get(self, request, link_id):
        link = self.get_link(link_id, request.user)
        clicks = ClickEvent.objects.filter(short_link=link).order_by("-timestamp")

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="linkpulse_{link.short_code}_clicks.csv"'
        )

        writer = csv.writer(response)
        writer.writerow(
            [
                "timestamp",
                "country",
                "region",
                "city",
                "device_type",
                "browser",
                "os",
                "referrer",
                "referrer_domain",
                "utm_source",
                "utm_medium",
                "utm_campaign",
                "is_bot",
            ]
        )

        for click in clicks:
            writer.writerow(
                [
                    click.timestamp.isoformat(),
                    click.country or "",
                    click.region or "",
                    click.city or "",
                    click.device_type,
                    click.browser,
                    click.os,
                    click.referrer,
                    click.referrer_domain,
                    click.utm_source,
                    click.utm_medium,
                    click.utm_campaign,
                    click.is_bot,
                ]
            )

        return response
