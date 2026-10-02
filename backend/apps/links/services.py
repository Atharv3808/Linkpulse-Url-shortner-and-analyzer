from django.core.cache import cache
from django.db import transaction
from rest_framework.exceptions import NotFound, ValidationError

from apps.common.constants import RESERVED_SHORT_CODES
from apps.common.exceptions import CustomAliasTaken, WorkspaceAccessDenied
from apps.common.utils import generate_short_code
from apps.links.models import ShortLink
from apps.workspaces.models import Workspace, WorkspaceMember


class LinkService:
    CACHE_KEY_PREFIX = "short_link:"

    @classmethod
    def get_cache_key(cls, short_code: str) -> str:
        return f"{cls.CACHE_KEY_PREFIX}{short_code}"

    @classmethod
    def generate_unique_code(cls, length: int = 6, max_retries: int = 10) -> str:
        for _ in range(max_retries):
            code = generate_short_code(length)
            if code.lower() in RESERVED_SHORT_CODES:
                continue
            if not ShortLink.objects.filter(short_code=code).exists():
                return code
        # If collision after max_retries, increase length
        return generate_short_code(length + 2)

    @classmethod
    @transaction.atomic
    def create_link(
        cls,
        user,
        original_url: str,
        title: str = "",
        custom_alias: str = "",
        workspace_id: str = None,
        campaign_id: str = None,
        expires_at=None,
    ) -> ShortLink:
        # Determine workspace
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

        # Handle short_code or custom alias
        if custom_alias:
            alias_clean = custom_alias.strip().lower()
            if alias_clean in RESERVED_SHORT_CODES:
                raise CustomAliasTaken(f"The alias '{alias_clean}' is reserved.")
            if ShortLink.objects.filter(short_code=alias_clean).exists():
                raise CustomAliasTaken(f"The alias '{alias_clean}' is already taken.")
            short_code = alias_clean
        else:
            short_code = cls.generate_unique_code()

        # Handle campaign if provided
        campaign = None
        if campaign_id:
            from apps.campaigns.models import Campaign

            try:
                campaign = Campaign.objects.get(id=campaign_id, workspace=workspace)
            except Campaign.DoesNotExist as e:
                raise ValidationError(
                    {"campaign_id": "Campaign not found in this workspace."}
                ) from e

        link = ShortLink.objects.create(
            workspace=workspace,
            created_by=user,
            campaign=campaign,
            short_code=short_code,
            original_url=original_url,
            title=title or original_url,
            expires_at=expires_at,
        )

        return link

    @classmethod
    def update_link(cls, link: ShortLink, **data) -> ShortLink:
        for attr, value in data.items():
            setattr(link, attr, value)
        link.save()
        cls.invalidate_cache(link.short_code)
        return link

    @classmethod
    def soft_delete_link(cls, link: ShortLink):
        """Soft delete: set is_active=False preserving historical analytics (Section 36)."""
        link.is_active = False
        link.save(update_fields=["is_active", "updated_at"])
        cls.invalidate_cache(link.short_code)

    @classmethod
    def get_cached_destination(cls, short_code: str):
        key = cls.get_cache_key(short_code)
        return cache.get(key)

    @classmethod
    def set_cached_destination(
        cls, short_code: str, original_url: str, timeout: int = 300
    ):
        key = cls.get_cache_key(short_code)
        cache.set(key, original_url, timeout=timeout)

    @classmethod
    def invalidate_cache(cls, short_code: str):
        key = cls.get_cache_key(short_code)
        cache.delete(key)
