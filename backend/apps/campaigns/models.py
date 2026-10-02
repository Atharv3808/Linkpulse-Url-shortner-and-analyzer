from django.conf import settings
from django.db import models
from django.utils.text import slugify

from apps.common.models import BaseModel
from apps.workspaces.models import Workspace


class Campaign(BaseModel):
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name="campaigns"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campaigns",
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField(blank=True, default="")
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("workspace", "slug")

    def __str__(self):
        return f"{self.name} ({self.workspace.name})"

    @classmethod
    def generate_slug(cls, workspace: Workspace, name: str) -> str:
        base_slug = slugify(name) or "campaign"
        slug = base_slug
        counter = 1
        while cls.objects.filter(workspace=workspace, slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug
