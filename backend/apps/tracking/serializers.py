from rest_framework import serializers

from apps.tracking.models import ClickEvent


class ClickEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClickEvent
        fields = [
            "id",
            "short_link",
            "timestamp",
            "country",
            "region",
            "city",
            "device_type",
            "browser",
            "browser_version",
            "os",
            "os_version",
            "referrer",
            "referrer_domain",
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "is_bot",
            "bot_name",
        ]
