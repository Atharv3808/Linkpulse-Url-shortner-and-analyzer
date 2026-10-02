from rest_framework import serializers

from apps.links.models import ShortLink
from apps.links.validators import validate_custom_alias, validate_destination_url


class ShortLinkSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = ShortLink
        fields = [
            "id",
            "workspace",
            "campaign",
            "short_code",
            "short_url",
            "original_url",
            "title",
            "is_active",
            "expires_at",
            "is_expired",
            "click_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "workspace",
            "short_code",
            "short_url",
            "is_expired",
            "click_count",
            "created_at",
            "updated_at",
        ]

    def get_short_url(self, obj):
        request = self.context.get("request")
        domain = request.build_absolute_uri("/").rstrip("/") if request else None
        return obj.get_short_url(domain)


class CreateShortLinkSerializer(serializers.Serializer):
    original_url = serializers.CharField()
    title = serializers.CharField(required=False, allow_blank=True, default="")
    custom_alias = serializers.CharField(required=False, allow_blank=True, default="")
    workspace_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    campaign_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    expires_at = serializers.DateTimeField(
        required=False, allow_null=True, default=None
    )

    def validate_original_url(self, value):
        return validate_destination_url(value)

    def validate_custom_alias(self, value):
        if value:
            return validate_custom_alias(value)
        return ""


class UpdateShortLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortLink
        fields = ["title", "original_url", "is_active", "expires_at", "campaign"]

    def validate_original_url(self, value):
        if value:
            return validate_destination_url(value)
        return value
