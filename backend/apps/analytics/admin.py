from django.contrib import admin

from apps.analytics.models import DailyLinkStats


@admin.register(DailyLinkStats)
class DailyLinkStatsAdmin(admin.ModelAdmin):
    list_display = (
        "short_link",
        "date",
        "total_clicks",
        "unique_visitors",
        "bot_clicks",
        "mobile_clicks",
        "desktop_clicks",
        "top_country",
    )
    list_filter = ("date",)
    search_fields = ("short_link__short_code", "top_country", "top_referrer")
    readonly_fields = [f.name for f in DailyLinkStats._meta.fields]
