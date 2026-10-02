from django.contrib import admin

from apps.links.models import ShortLink


@admin.register(ShortLink)
class ShortLinkAdmin(admin.ModelAdmin):
    list_display = (
        "short_code",
        "title",
        "original_url",
        "workspace",
        "is_active",
        "click_count",
        "created_at",
    )
    list_filter = ("is_active", "created_at", "workspace")
    search_fields = ("short_code", "title", "original_url")
    readonly_fields = ("click_count", "created_at", "updated_at")
