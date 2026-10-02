import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestAuthentication:
    def test_register_user_success(self, api_client):
        url = reverse("auth-register")
        payload = {
            "email": "newuser@linkpulse.app",
            "password": "SecurePassword123!",
            "first_name": "New",
            "last_name": "User",
            "workspace_name": "My Acme Workspace",
        }
        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["success"] is True
        assert "tokens" in response.data["data"]
        assert "access" in response.data["data"]["tokens"]
        assert response.data["data"]["user"]["email"] == "newuser@linkpulse.app"
        assert response.data["data"]["workspace"]["name"] == "My Acme Workspace"

    def test_login_user_success(self, api_client, user):
        url = reverse("auth-login")
        payload = {
            "email": user.email,
            "password": "TestPassword123!",
        }
        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert "access" in response.data["data"]["tokens"]

    def test_login_invalid_password(self, api_client, user):
        url = reverse("auth-login")
        payload = {
            "email": user.email,
            "password": "WrongPassword!",
        }
        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data["success"] is False

    def test_me_authenticated(self, auth_client, user):
        url = reverse("auth-me")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["data"]["email"] == user.email

    def test_me_unauthenticated(self, api_client):
        url = reverse("auth-me")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
