from django.db import models

from apps.common.models import BaseModel
from apps.links.models import ShortLink


class DailyLinkStats(BaseModel):
    short_link = models.ForeignKey(
        ShortLink, on_delete=models.CASCADE, related_name="daily_stats", db_index=True
    )
    date = models.DateField(db_index=True)

    total_clicks = models.BigIntegerField(default=0)
    unique_visitors = models.BigIntegerField(default=0)
    bot_clicks = models.BigIntegerField(default=0)

    mobile_clicks = models.BigIntegerField(default=0)
    desktop_clicks = models.BigIntegerField(default=0)
    tablet_clicks = models.BigIntegerField(default=0)

    top_country = models.CharField(max_length=100, null=True, blank=True)
    top_referrer = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ("short_link", "date")
        indexes = [
            models.Index(fields=["short_link", "date"]),
        ]

    def __str__(self):
        return f"DailyStats for {self.short_link.short_code} on {self.date}"
