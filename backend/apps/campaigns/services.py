from rest_framework.exceptions import NotFound

from apps.campaigns.models import Campaign
from apps.common.exceptions import WorkspaceAccessDenied
from apps.workspaces.models import Workspace, WorkspaceMember


class CampaignService:
    @staticmethod
    def create_campaign(
        user,
        name: str,
        description: str = "",
        workspace_id: str = None,
        start_date=None,
        end_date=None,
    ) -> Campaign:
        if workspace_id:
            try:
                workspace = Workspace.objects.get(id=workspace_id)
            except Workspace.DoesNotExist as e:
                raise NotFound("Workspace not found.") from e
            if not WorkspaceMember.objects.filter(
                workspace=workspace, user=user
            ).exists():
                raise WorkspaceAccessDenied("You do not belong to this workspace.")
        else:
            membership = WorkspaceMember.objects.filter(user=user).first()
            if not membership:
                raise WorkspaceAccessDenied("User has no active workspace.")
            workspace = membership.workspace

        slug = Campaign.generate_slug(workspace, name)

        campaign = Campaign.objects.create(
            workspace=workspace,
            created_by=user,
            name=name,
            slug=slug,
            description=description,
            start_date=start_date,
            end_date=end_date,
        )
        return campaign
