from rest_framework import permissions

from apps.workspaces.models import WorkspaceMember


class IsWorkspaceMember(permissions.BasePermission):
    """
    Allows access only to members of the target workspace.
    Assumes view/action provides `workspace` or `workspace_id`.
    """

    def has_object_permission(self, request, view, obj):
        workspace = getattr(obj, "workspace", obj)
        if not request.user or not request.user.is_authenticated:
            return False
        return WorkspaceMember.objects.filter(
            workspace=workspace, user=request.user
        ).exists()


class IsWorkspaceAdminOrOwner(permissions.BasePermission):
    """
    Allows access only to OWNER or ADMIN members of the workspace.
    """

    def has_object_permission(self, request, view, obj):
        workspace = getattr(obj, "workspace", obj)
        if not request.user or not request.user.is_authenticated:
            return False
        return WorkspaceMember.objects.filter(
            workspace=workspace,
            user=request.user,
            role__in=[WorkspaceMember.Role.OWNER, WorkspaceMember.Role.ADMIN],
        ).exists()


class IsWorkspaceOwner(permissions.BasePermission):
    """
    Allows access only to the OWNER of the workspace.
    """

    def has_object_permission(self, request, view, obj):
        workspace = getattr(obj, "workspace", obj)
        if not request.user or not request.user.is_authenticated:
            return False
        return WorkspaceMember.objects.filter(
            workspace=workspace,
            user=request.user,
            role=WorkspaceMember.Role.OWNER,
        ).exists()
