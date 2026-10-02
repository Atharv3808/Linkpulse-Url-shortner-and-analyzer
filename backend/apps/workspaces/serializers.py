from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from apps.workspaces.models import Workspace, WorkspaceMember

User = get_user_model()


class WorkspaceSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = [
            "id",
            "name",
            "slug",
            "owner",
            "role",
            "member_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "owner",
            "role",
            "member_count",
            "created_at",
            "updated_at",
        ]

    def get_role(self, obj):
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return None
        membership = obj.members.filter(user=request.user).first()
        return membership.role if membership else None

    def get_member_count(self, obj):
        return obj.members.count()


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = WorkspaceMember
        fields = ["id", "workspace", "user", "role", "joined_at"]
        read_only_fields = ["id", "workspace", "user", "joined_at"]


class AddWorkspaceMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(
        choices=WorkspaceMember.Role.choices, default=WorkspaceMember.Role.MEMBER
    )


class UpdateWorkspaceMemberSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=WorkspaceMember.Role.choices)
