from django.db import models

from apps.common.models import BaseModel
from apps.links.models import ShortLink


class ClickEvent(BaseModel):
    short_link = models.ForeignKey(
        ShortLink, on_delete=models.CASCADE, related_name="click_events", db_index=True
    )
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    event_id = models.UUIDField(unique=True, null=True, blank=True, db_index=True)
    visitor_id = models.CharField(max_length=64, db_index=True, blank=True)
    ip_hash = models.CharField(max_length=64, blank=True)

    country = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    device_type = models.CharField(max_length=32, default="unknown", db_index=True)
    browser = models.CharField(max_length=64, default="unknown", db_index=True)
    browser_version = models.CharField(max_length=32, blank=True, default="")
    os = models.CharField(max_length=64, default="unknown", db_index=True)
    os_version = models.CharField(max_length=32, blank=True, default="")

    user_agent = models.TextField(blank=True, default="")
    referrer = models.TextField(blank=True, default="")
    referrer_domain = models.CharField(max_length=255, default="direct", db_index=True)

    utm_source = models.CharField(max_length=255, blank=True, default="", db_index=True)
    utm_medium = models.CharField(max_length=255, blank=True, default="")
    utm_campaign = models.CharField(
        max_length=255, blank=True, default="", db_index=True
    )
    utm_term = models.CharField(max_length=255, blank=True, default="")
    utm_content = models.CharField(max_length=255, blank=True, default="")

    is_bot = models.BooleanField(default=False, db_index=True)
    bot_name = models.CharField(max_length=100, blank=True, default="")

    language = models.CharField(max_length=32, blank=True, default="")
    timezone = models.CharField(max_length=64, blank=True, default="")
    response_status = models.IntegerField(default=302)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["short_link", "timestamp"]),
            models.Index(fields=["visitor_id", "timestamp"]),
            models.Index(fields=["country", "timestamp"]),
        ]

    def __str__(self):
        return f"Click on {self.short_link.short_code} at {self.timestamp}"
