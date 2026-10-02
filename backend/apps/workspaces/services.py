from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework.exceptions import NotFound, ValidationError

from apps.workspaces.models import Workspace, WorkspaceMember

User = get_user_model()


class WorkspaceService:
    @staticmethod
    @transaction.atomic
    def create_workspace(user, name: str, slug: str = "") -> Workspace:
        if not slug:
            slug = Workspace.generate_slug(name)
        elif Workspace.objects.filter(slug=slug).exists():
            raise ValidationError(
                {"slug": "A workspace with this slug already exists."}
            )

        workspace = Workspace.objects.create(name=name, slug=slug, owner=user)
        WorkspaceMember.objects.create(
            workspace=workspace, user=user, role=WorkspaceMember.Role.OWNER
        )
        return workspace

    @staticmethod
    def add_member(workspace: Workspace, email: str, role: str) -> WorkspaceMember:
        email = email.lower().strip()
        try:
            target_user = User.objects.get(email__iexact=email)
        except User.DoesNotExist as e:
            raise ValidationError(
                {"email": f"User with email '{email}' does not exist."}
            ) from e

        if WorkspaceMember.objects.filter(
            workspace=workspace, user=target_user
        ).exists():
            raise ValidationError(
                {"email": "User is already a member of this workspace."}
            )

        return WorkspaceMember.objects.create(
            workspace=workspace, user=target_user, role=role
        )

    @staticmethod
    def update_member_role(
        workspace: Workspace, member_id: str, new_role: str
    ) -> WorkspaceMember:
        try:
            member = WorkspaceMember.objects.get(id=member_id, workspace=workspace)
        except WorkspaceMember.DoesNotExist as e:
            raise NotFound("Workspace member not found.") from e

        if (
            member.role == WorkspaceMember.Role.OWNER
            and new_role != WorkspaceMember.Role.OWNER
        ):
            owner_count = WorkspaceMember.objects.filter(
                workspace=workspace, role=WorkspaceMember.Role.OWNER
            ).count()
            if owner_count <= 1:
                raise ValidationError(
                    "Cannot downgrade the only owner of the workspace."
                )

        member.role = new_role
        member.save()
        return member

    @staticmethod
    def remove_member(workspace: Workspace, member_id: str):
        try:
            member = WorkspaceMember.objects.get(id=member_id, workspace=workspace)
        except WorkspaceMember.DoesNotExist as e:
            raise NotFound("Workspace member not found.") from e

        if member.role == WorkspaceMember.Role.OWNER:
            owner_count = WorkspaceMember.objects.filter(
                workspace=workspace, role=WorkspaceMember.Role.OWNER
            ).count()
            if owner_count <= 1:
                raise ValidationError("Cannot remove the only owner of the workspace.")

        member.delete()
