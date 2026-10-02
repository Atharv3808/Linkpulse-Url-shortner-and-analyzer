from django.contrib import admin

from apps.campaigns.models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "workspace", "created_by", "created_at")
    list_filter = ("workspace", "created_at")
    search_fields = ("name", "slug", "description")
