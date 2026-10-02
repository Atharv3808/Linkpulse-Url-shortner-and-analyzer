from django.contrib import admin

from apps.tracking.models import ClickEvent


@admin.register(ClickEvent)
class ClickEventAdmin(admin.ModelAdmin):
    list_display = (
        "short_link",
        "timestamp",
        "country",
        "device_type",
        "browser",
        "os",
        "referrer_domain",
        "is_bot",
    )
    list_filter = ("device_type", "is_bot", "country", "timestamp")
    search_fields = ("short_link__short_code", "referrer_domain", "country", "bot_name")
    readonly_fields = [f.name for f in ClickEvent._meta.fields]

    def has_add_permission(self, request):
        return False
