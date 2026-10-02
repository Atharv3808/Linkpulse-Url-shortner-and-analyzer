from django.urls import path

from apps.analytics.views import (
    LinkAnalyticsDetailView,
    LinkCountriesView,
    LinkDevicesView,
    LinkExportView,
    LinkReferrersView,
    LinkTimelineView,
    OverviewAnalyticsView,
)

urlpatterns = [
    path("overview/", OverviewAnalyticsView.as_view(), name="analytics-overview"),
    path(
        "links/<uuid:link_id>/",
        LinkAnalyticsDetailView.as_view(),
        name="analytics-link-detail",
    ),
    path(
        "links/<uuid:link_id>/timeline/",
        LinkTimelineView.as_view(),
        name="analytics-link-timeline",
    ),
    path(
        "links/<uuid:link_id>/countries/",
        LinkCountriesView.as_view(),
        name="analytics-link-countries",
    ),
    path(
        "links/<uuid:link_id>/devices/",
        LinkDevicesView.as_view(),
        name="analytics-link-devices",
    ),
    path(
        "links/<uuid:link_id>/referrers/",
        LinkReferrersView.as_view(),
        name="analytics-link-referrers",
    ),
    path(
        "links/<uuid:link_id>/export/",
        LinkExportView.as_view(),
        name="analytics-link-export",
    ),
]
