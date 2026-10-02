import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.workspaces.models import Workspace, WorkspaceMember

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="testuser@linkpulse.app",
        password="TestPassword123!",
        first_name="Test",
        last_name="User",
    )


@pytest.fixture
def workspace(db, user):
    ws = Workspace.objects.create(
        name="Test Workspace",
        slug="test-workspace",
        owner=user,
    )
    WorkspaceMember.objects.create(
        workspace=ws,
        user=user,
        role=WorkspaceMember.Role.OWNER,
    )
    return ws


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def user2(db):
    return User.objects.create_user(
        email="otheruser@linkpulse.app",
        password="OtherPassword123!",
        first_name="Other",
        last_name="User",
    )


@pytest.fixture
def workspace2(db, user2):
    ws = Workspace.objects.create(
        name="Other Workspace",
        slug="other-workspace",
        owner=user2,
    )
    WorkspaceMember.objects.create(
        workspace=ws,
        user=user2,
        role=WorkspaceMember.Role.OWNER,
    )
    return ws


@pytest.fixture
def auth_client2(api_client, user2):
    api_client.force_authenticate(user=user2)
    return api_client
