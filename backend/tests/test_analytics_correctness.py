import pytest
from django.urls import reverse
from rest_framework import status

from apps.links.models import ShortLink
from apps.tracking.models import ClickEvent


@pytest.mark.django_db
class TestAnalyticsCorrectness:
    def test_link_analytics_breakdown(self, auth_client, workspace):
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="analytics123",
            original_url="https://example.com/analytics-test",
            title="Analytics Link",
        )

        # Create 3 human clicks and 1 bot click
        ClickEvent.objects.create(
            short_link=link,
            visitor_id="v1",
            country="United States",
            device_type="desktop",
            referrer_domain="linkedin.com",
            is_bot=False,
        )
        ClickEvent.objects.create(
            short_link=link,
            visitor_id="v2",
            country="United States",
            device_type="mobile",
            referrer_domain="linkedin.com",
            is_bot=False,
        )
        ClickEvent.objects.create(
            short_link=link,
            visitor_id="v1",
            country="India",
            device_type="desktop",
            referrer_domain="google.com",
            is_bot=False,
        )
        ClickEvent.objects.create(
            short_link=link,
            visitor_id="v3",
            country="Germany",
            device_type="bot",
            referrer_domain="direct",
            is_bot=True,
        )

        url = reverse("analytics-link-detail", kwargs={"link_id": link.id})
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        data = response.data["data"]

        # Summary check
        assert data["summary"]["total_clicks"] == 4
        assert data["summary"]["unique_visitors"] == 3  # v1, v2, v3
        assert data["summary"]["bot_clicks"] == 1
        assert data["summary"]["human_clicks"] == 3

        # Countries check
        countries = {c["country"]: c["clicks"] for c in data["countries"]}
        assert countries["United States"] == 2
        assert countries["India"] == 1

        # Devices check
        assert data["devices"]["counts"]["desktop"] == 2
        assert data["devices"]["counts"]["mobile"] == 1
        assert data["devices"]["counts"]["bot"] == 1

    def test_csv_export(self, auth_client, workspace):
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="csvexport",
            original_url="https://example.com/csv",
        )
        ClickEvent.objects.create(
            short_link=link,
            visitor_id="v1",
            country="United States",
            device_type="desktop",
            referrer_domain="google.com",
        )

        url = reverse("analytics-link-export", kwargs={"link_id": link.id})
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response["Content-Type"] == "text/csv"
        assert "timestamp,country,region,city" in response.content.decode("utf-8")
        assert "United States" in response.content.decode("utf-8")
