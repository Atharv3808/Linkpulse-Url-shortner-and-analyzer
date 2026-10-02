import pytest
from django.urls import reverse
from rest_framework import status

from apps.links.models import ShortLink


@pytest.mark.django_db
class TestSecurity:
    def test_cross_workspace_link_isolation(self, auth_client2, workspace):
        # Link created in Workspace 1 (owned by User 1)
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="secretlink",
            original_url="https://example.com/secret",
            title="Secret Link",
        )

        # User 2 tries to fetch link from Workspace 1
        url = reverse("link-detail", kwargs={"pk": link.id})
        response = auth_client2.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_cannot_create_link_in_unauthorized_workspace(
        self, auth_client2, workspace
    ):
        # User 2 tries to create a link specifying User 1's workspace_id
        url = reverse("link-list")
        payload = {
            "original_url": "https://example.com/unauthorized",
            "workspace_id": str(workspace.id),
        }
        response = auth_client2.post(url, payload, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data["error"]["code"] == "WORKSPACE_ACCESS_DENIED"
