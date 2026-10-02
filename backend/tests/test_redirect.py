from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone

from apps.links.models import ShortLink


@pytest.mark.django_db
class TestRedirectEngine:
    def test_valid_redirect_success(self, api_client, workspace):
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="redir123",
            original_url="https://example.com/redirect-dest",
            title="Redirect Test",
        )
        url = reverse("short-link-redirect", kwargs={"short_code": link.short_code})
        response = api_client.get(url)

        assert response.status_code == 302
        assert response["Location"] == "https://example.com/redirect-dest"
        assert "lp_vid" in response.cookies

        link.refresh_from_db()
        assert link.click_count == 1

    def test_redirect_non_existent_code(self, api_client):
        url = reverse("short-link-redirect", kwargs={"short_code": "nonexistent999"})
        response = api_client.get(url)
        assert response.status_code == 404

    def test_redirect_disabled_link(self, api_client, workspace):
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="disabled123",
            original_url="https://example.com/disabled",
            is_active=False,
        )
        url = reverse("short-link-redirect", kwargs={"short_code": link.short_code})
        response = api_client.get(url)
        assert response.status_code == 404

    def test_redirect_expired_link(self, api_client, workspace):
        past_time = timezone.now() - timedelta(hours=1)
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="expired123",
            original_url="https://example.com/expired",
            expires_at=past_time,
        )
        url = reverse("short-link-redirect", kwargs={"short_code": link.short_code})
        response = api_client.get(url)
        assert response.status_code == 404
