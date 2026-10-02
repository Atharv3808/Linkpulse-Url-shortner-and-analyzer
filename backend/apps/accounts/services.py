from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.workspaces.models import Workspace, WorkspaceMember

User = get_user_model()


class AuthService:
    @staticmethod
    @transaction.atomic
    def register_user(
        email: str,
        password: str,
        first_name: str = "",
        last_name: str = "",
        workspace_name: str = "",
    ):
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError({"email": "A user with this email already exists."})

        user = User.objects.create_user(
            email=email.lower().strip(),
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        # Create default workspace
        name = (
            workspace_name.strip()
            if workspace_name
            else f"{user.email.split('@')[0]}'s Workspace"
        )
        base_slug = Workspace.generate_slug(name)
        workspace = Workspace.objects.create(
            name=name,
            slug=base_slug,
            owner=user,
        )

        WorkspaceMember.objects.create(
            workspace=workspace,
            user=user,
            role=WorkspaceMember.Role.OWNER,
        )

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "workspace": workspace,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
        }

    @staticmethod
    def login_user(email: str, password: str):
        user = authenticate(username=email.lower().strip(), password=password)
        if not user:
            raise AuthenticationFailed("Invalid email or password.")
        if not user.is_active:
            raise AuthenticationFailed("User account is disabled.")

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
        }
