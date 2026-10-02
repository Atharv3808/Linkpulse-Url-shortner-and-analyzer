import pytest
from django.urls import reverse
from rest_framework import status

from apps.links.models import ShortLink


@pytest.mark.django_db
class TestLinks:
    def test_create_short_link_success(self, auth_client, workspace):
        url = reverse("link-list")
        payload = {
            "original_url": "https://example.com/target-page",
            "title": "Example Target Page",
            "workspace_id": str(workspace.id),
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["success"] is True
        data = response.data["data"]
        assert data["original_url"] == "https://example.com/target-page"
        assert len(data["short_code"]) == 6
        assert data["is_active"] is True

    def test_create_link_custom_alias(self, auth_client, workspace):
        url = reverse("link-list")
        payload = {
            "original_url": "https://example.com/custom",
            "title": "Custom Alias Link",
            "custom_alias": "my-custom-alias",
            "workspace_id": str(workspace.id),
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["data"]["short_code"] == "my-custom-alias"

    def test_create_link_duplicate_custom_alias(self, auth_client, workspace):
        url = reverse("link-list")
        payload = {
            "original_url": "https://example.com/1",
            "custom_alias": "duplicate-alias",
            "workspace_id": str(workspace.id),
        }
        auth_client.post(url, payload, format="json")
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["error"]["code"] == "CUSTOM_ALIAS_TAKEN"

    def test_create_link_reserved_alias(self, auth_client, workspace):
        url = reverse("link-list")
        payload = {
            "original_url": "https://example.com/reserved",
            "custom_alias": "admin",
            "workspace_id": str(workspace.id),
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["error"]["code"] == "CUSTOM_ALIAS_TAKEN"

    def test_create_link_invalid_scheme(self, auth_client, workspace):
        url = reverse("link-list")
        payload = {
            "original_url": "javascript:alert('xss')",
            "workspace_id": str(workspace.id),
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["error"]["code"] == "INVALID_URL"

    def test_soft_delete_link(self, auth_client, workspace):
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="delete-me",
            original_url="https://example.com/del",
            title="Delete Me",
        )
        url = reverse("link-detail", kwargs={"pk": link.id})
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_200_OK

        link.refresh_from_db()
        assert link.is_active is False
