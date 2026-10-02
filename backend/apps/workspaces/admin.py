from django.contrib import admin

from apps.workspaces.models import Workspace, WorkspaceMember


class WorkspaceMemberInline(admin.TabularInline):
    model = WorkspaceMember
    extra = 1


@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "owner", "created_at")
    search_fields = ("name", "slug", "owner__email")
    inlines = [WorkspaceMemberInline]


@admin.register(WorkspaceMember)
class WorkspaceMemberAdmin(admin.ModelAdmin):
    list_display = ("workspace", "user", "role", "joined_at")
    list_filter = ("role",)
    search_fields = ("workspace__name", "user__email")
