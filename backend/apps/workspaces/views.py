from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.permissions import IsWorkspaceAdminOrOwner, IsWorkspaceMember
from apps.workspaces.models import Workspace
from apps.workspaces.serializers import (
    AddWorkspaceMemberSerializer,
    UpdateWorkspaceMemberSerializer,
    WorkspaceMemberSerializer,
    WorkspaceSerializer,
)
from apps.workspaces.services import WorkspaceService


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(members__user=self.request.user).distinct()

    def perform_create(self, serializer):
        name = serializer.validated_data["name"]
        slug = serializer.validated_data.get("slug", "")
        workspace = WorkspaceService.create_workspace(
            user=self.request.user, name=name, slug=slug
        )
        serializer.instance = workspace

    @extend_schema(summary="List members of a workspace")
    @action(
        detail=True,
        methods=["get"],
        url_path="members",
        permission_classes=[permissions.IsAuthenticated, IsWorkspaceMember],
    )
    def list_members(self, request, pk=None):
        workspace = self.get_object()
        members = workspace.members.select_related("user").all()
        serializer = WorkspaceMemberSerializer(members, many=True)
        return Response({"success": True, "data": serializer.data})

    @extend_schema(
        request=AddWorkspaceMemberSerializer, summary="Add member to workspace"
    )
    @action(
        detail=True,
        methods=["post"],
        url_path="members/add",
        permission_classes=[permissions.IsAuthenticated, IsWorkspaceAdminOrOwner],
    )
    def add_member(self, request, pk=None):
        workspace = self.get_object()
        serializer = AddWorkspaceMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        member = WorkspaceService.add_member(
            workspace=workspace,
            email=serializer.validated_data["email"],
            role=serializer.validated_data["role"],
        )
        return Response(
            {"success": True, "data": WorkspaceMemberSerializer(member).data},
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        request=UpdateWorkspaceMemberSerializer,
        summary="Update member role in workspace",
    )
    @action(
        detail=True,
        methods=["patch"],
        url_path="members/(?P<member_id>[^/.]+)",
        permission_classes=[permissions.IsAuthenticated, IsWorkspaceAdminOrOwner],
    )
    def update_member_role(self, request, pk=None, member_id=None):
        workspace = self.get_object()
        serializer = UpdateWorkspaceMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        member = WorkspaceService.update_member_role(
            workspace=workspace,
            member_id=member_id,
            new_role=serializer.validated_data["role"],
        )
        return Response(
            {"success": True, "data": WorkspaceMemberSerializer(member).data}
        )

    @extend_schema(summary="Remove member from workspace")
    @action(
        detail=True,
        methods=["delete"],
        url_path="members/(?P<member_id>[^/.]+)/remove",
        permission_classes=[permissions.IsAuthenticated, IsWorkspaceAdminOrOwner],
    )
    def remove_member(self, request, pk=None, member_id=None):
        workspace = self.get_object()
        WorkspaceService.remove_member(workspace=workspace, member_id=member_id)
        return Response(
            {"success": True, "data": {"message": "Member removed successfully."}}
        )
