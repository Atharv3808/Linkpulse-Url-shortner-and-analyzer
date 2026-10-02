import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestThrottling:
    def test_auth_rate_limiting(self, api_client):
        cache.clear()
        url = reverse("auth-login")
        payload = {"email": "nonexistent@linkpulse.app", "password": "wrong"}

        responses = []
        for _ in range(15):
            responses.append(api_client.post(url, payload, format="json"))

        status_codes = [r.status_code for r in responses]
        assert status.HTTP_429_TOO_MANY_REQUESTS in status_codes
        assert responses[-1].status_code == status.HTTP_429_TOO_MANY_REQUESTS
        assert responses[-1].data["success"] is False
        assert responses[-1].data["error"]["code"] == "THROTTLED"
