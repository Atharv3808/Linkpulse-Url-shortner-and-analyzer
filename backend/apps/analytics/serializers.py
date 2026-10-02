from rest_framework import serializers

from apps.analytics.models import DailyLinkStats


class DailyLinkStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLinkStats
        fields = [
            "id",
            "short_link",
            "date",
            "total_clicks",
            "unique_visitors",
            "bot_clicks",
            "mobile_clicks",
            "desktop_clicks",
            "tablet_clicks",
            "top_country",
            "top_referrer",
        ]


class AnalyticsOverviewSerializer(serializers.Serializer):
    total_clicks = serializers.IntegerField()
    unique_visitors = serializers.IntegerField()
    active_links = serializers.IntegerField()
    bot_clicks = serializers.IntegerField()
    clicks_today = serializers.IntegerField()
    clicks_this_week = serializers.IntegerField()
    clicks_this_month = serializers.IntegerField()
