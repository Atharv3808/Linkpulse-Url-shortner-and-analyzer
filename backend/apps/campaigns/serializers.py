from rest_framework import serializers

from apps.campaigns.models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    link_count = serializers.SerializerMethodField()
    total_clicks = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            "id",
            "workspace",
            "name",
            "slug",
            "description",
            "start_date",
            "end_date",
            "link_count",
            "total_clicks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "workspace",
            "slug",
            "link_count",
            "total_clicks",
            "created_at",
            "updated_at",
        ]

    def get_link_count(self, obj):
        return obj.short_links.count()

    def get_total_clicks(self, obj):
        from django.db.models import Sum

        result = obj.short_links.aggregate(total=Sum("click_count"))
        return result["total"] or 0


class CreateCampaignSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, default="")
    workspace_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    start_date = serializers.DateTimeField(
        required=False, allow_null=True, default=None
    )
    end_date = serializers.DateTimeField(required=False, allow_null=True, default=None)
