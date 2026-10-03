from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.common.models import BaseModel
from apps.workspaces.models import Workspace


class ShortLink(BaseModel):
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name="short_links", db_index=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_links",
    )
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="short_links",
    )
    short_code = models.CharField(max_length=32, unique=True, db_index=True)
    original_url = models.URLField(max_length=2048)
    title = models.CharField(max_length=255, blank=True, default="")
    is_active = models.BooleanField(default=True, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    click_count = models.BigIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["workspace", "created_at"]),
            models.Index(fields=["short_code", "is_active"]),
        ]

    def __str__(self):
        return f"{self.short_code} -> {self.original_url[:30]}"

    @property
    def is_expired(self) -> bool:
        if self.expires_at and self.expires_at <= timezone.now():
            return True
        return False

    def get_short_url(self, domain: str = None) -> str:
        default_domain = getattr(
            settings, "DEFAULT_DOMAIN", "https://linkpulse-api-iibx.onrender.com"
        )
        if not domain or ("localhost" in domain or "127.0.0.1" in domain):
            domain = default_domain

        base = (
            domain
            or getattr(settings, "DEFAULT_DOMAIN", "https://linkpulse-api-iibx.onrender.com")
        ).rstrip("/")
        return f"{base}/{self.short_code}"
