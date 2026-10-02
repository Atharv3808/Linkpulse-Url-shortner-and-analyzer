from datetime import timedelta

from django.db.models import Count, Q
from django.db.models.functions import TruncDay, TruncHour
from django.utils import timezone

from apps.links.models import ShortLink
from apps.tracking.models import ClickEvent
from apps.workspaces.models import WorkspaceMember


class AnalyticsService:
    @staticmethod
    def _parse_range(range_param: str):
        now = timezone.now()
        range_param = (range_param or "30d").lower()

        if range_param == "today":
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            truncate_by = "hour"
        elif range_param == "24h":
            start_date = now - timedelta(hours=24)
            truncate_by = "hour"
        elif range_param == "48h":
            start_date = now - timedelta(hours=48)
            truncate_by = "hour"
        elif range_param == "7d":
            start_date = now - timedelta(days=7)
            truncate_by = "day"
        elif range_param == "90d":
            start_date = now - timedelta(days=90)
            truncate_by = "day"
        else:  # default 30d
            start_date = now - timedelta(days=30)
            truncate_by = "day"

        return start_date, truncate_by

    @classmethod
    def get_overview(cls, user, workspace_id: str = None) -> dict:
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        month_start = now - timedelta(days=30)

        user_workspace_ids = WorkspaceMember.objects.filter(user=user).values_list(
            "workspace_id", flat=True
        )

        if workspace_id:
            user_workspace_ids = [
                ws_id for ws_id in user_workspace_ids if str(ws_id) == str(workspace_id)
            ]

        links_qs = ShortLink.objects.filter(workspace_id__in=user_workspace_ids)
        active_links = links_qs.filter(is_active=True).count()

        clicks_qs = ClickEvent.objects.filter(
            short_link__workspace_id__in=user_workspace_ids
        )

        total_clicks = clicks_qs.count()
        unique_visitors = (
            clicks_qs.values("visitor_id").filter(~Q(visitor_id="")).distinct().count()
        )
        bot_clicks = clicks_qs.filter(is_bot=True).count()

        clicks_today = clicks_qs.filter(timestamp__gte=today_start).count()
        clicks_this_week = clicks_qs.filter(timestamp__gte=week_start).count()
        clicks_this_month = clicks_qs.filter(timestamp__gte=month_start).count()

        return {
            "total_clicks": total_clicks,
            "unique_visitors": unique_visitors,
            "active_links": active_links,
            "bot_clicks": bot_clicks,
            "clicks_today": clicks_today,
            "clicks_this_week": clicks_this_week,
            "clicks_this_month": clicks_this_month,
        }

    @classmethod
    def get_link_summary(cls, link: ShortLink) -> dict:
        clicks_qs = ClickEvent.objects.filter(short_link=link)
        total_clicks = clicks_qs.count()
        unique_visitors = (
            clicks_qs.values("visitor_id").filter(~Q(visitor_id="")).distinct().count()
        )
        bot_clicks = clicks_qs.filter(is_bot=True).count()
        human_clicks = total_clicks - bot_clicks

        return {
            "total_clicks": total_clicks,
            "unique_visitors": unique_visitors,
            "bot_clicks": bot_clicks,
            "human_clicks": human_clicks,
        }

    @classmethod
    def get_timeline(cls, link: ShortLink, range_param: str = "30d") -> list:
        start_date, truncate_by = cls._parse_range(range_param)
        clicks_qs = ClickEvent.objects.filter(
            short_link=link, timestamp__gte=start_date
        )

        if truncate_by == "hour":
            timeline = (
                clicks_qs.annotate(period=TruncHour("timestamp"))
                .values("period")
                .annotate(
                    clicks=Count("id"),
                    unique_visitors=Count("visitor_id", distinct=True),
                )
                .order_by("period")
            )
            return [
                {
                    "timestamp": item["period"].isoformat(),
                    "clicks": item["clicks"],
                    "unique_visitors": item["unique_visitors"],
                }
                for item in timeline
            ]
        else:
            timeline = (
                clicks_qs.annotate(period=TruncDay("timestamp"))
                .values("period")
                .annotate(
                    clicks=Count("id"),
                    unique_visitors=Count("visitor_id", distinct=True),
                )
                .order_by("period")
            )
            return [
                {
                    "date": item["period"].strftime("%Y-%m-%d"),
                    "clicks": item["clicks"],
                    "unique_visitors": item["unique_visitors"],
                }
                for item in timeline
            ]

    @classmethod
    def get_countries(cls, link: ShortLink, range_param: str = "30d") -> list:
        start_date, _ = cls._parse_range(range_param)
        clicks_qs = ClickEvent.objects.filter(
            short_link=link, timestamp__gte=start_date
        )
        total = clicks_qs.count() or 1

        breakdown = (
            clicks_qs.values("country")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:20]
        )

        return [
            {
                "country": item["country"] or "Unknown",
                "clicks": item["clicks"],
                "percentage": round((item["clicks"] / total) * 100, 1),
            }
            for item in breakdown
        ]

    @classmethod
    def get_devices(cls, link: ShortLink, range_param: str = "30d") -> dict:
        start_date, _ = cls._parse_range(range_param)
        clicks_qs = ClickEvent.objects.filter(
            short_link=link, timestamp__gte=start_date
        )
        total = clicks_qs.count() or 1

        breakdown = (
            clicks_qs.values("device_type")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")
        )

        counts = {"desktop": 0, "mobile": 0, "tablet": 0, "bot": 0, "unknown": 0}
        percentages = {}

        for item in breakdown:
            dtype = item["device_type"]
            counts[dtype] = item["clicks"]

        for k, v in counts.items():
            percentages[k] = round((v / total) * 100, 1)

        return {"counts": counts, "percentages": percentages}

    @classmethod
    def get_browsers(cls, link: ShortLink, range_param: str = "30d") -> list:
        start_date, _ = cls._parse_range(range_param)
        breakdown = (
            ClickEvent.objects.filter(short_link=link, timestamp__gte=start_date)
            .values("browser")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:10]
        )
        return [
            {"browser": item["browser"], "clicks": item["clicks"]} for item in breakdown
        ]

    @classmethod
    def get_operating_systems(cls, link: ShortLink, range_param: str = "30d") -> list:
        start_date, _ = cls._parse_range(range_param)
        breakdown = (
            ClickEvent.objects.filter(short_link=link, timestamp__gte=start_date)
            .values("os")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:10]
        )
        return [{"os": item["os"], "clicks": item["clicks"]} for item in breakdown]

    @classmethod
    def get_referrers(cls, link: ShortLink, range_param: str = "30d") -> list:
        start_date, _ = cls._parse_range(range_param)
        breakdown = (
            ClickEvent.objects.filter(short_link=link, timestamp__gte=start_date)
            .values("referrer_domain")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:15]
        )
        return [
            {"source": item["referrer_domain"], "clicks": item["clicks"]}
            for item in breakdown
        ]

    @classmethod
    def get_utm_sources(cls, link: ShortLink, range_param: str = "30d") -> list:
        start_date, _ = cls._parse_range(range_param)
        breakdown = (
            ClickEvent.objects.filter(
                short_link=link, timestamp__gte=start_date, utm_source__gt=""
            )
            .values("utm_source")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:10]
        )
        return [
            {"utm_source": item["utm_source"], "clicks": item["clicks"]}
            for item in breakdown
        ]

    @classmethod
    def get_utm_campaigns(cls, link: ShortLink, range_param: str = "30d") -> list:
        start_date, _ = cls._parse_range(range_param)
        breakdown = (
            ClickEvent.objects.filter(
                short_link=link, timestamp__gte=start_date, utm_campaign__gt=""
            )
            .values("utm_campaign")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:10]
        )
        return [
            {"utm_campaign": item["utm_campaign"], "clicks": item["clicks"]}
            for item in breakdown
        ]

    @classmethod
    def get_full_link_analytics(cls, link: ShortLink, range_param: str = "30d") -> dict:
        summary = cls.get_link_summary(link)
        timeline = cls.get_timeline(link, range_param)
        countries = cls.get_countries(link, range_param)
        devices = cls.get_devices(link, range_param)
        browsers = cls.get_browsers(link, range_param)
        os_list = cls.get_operating_systems(link, range_param)
        referrers = cls.get_referrers(link, range_param)
        utm_sources = cls.get_utm_sources(link, range_param)
        utm_campaigns = cls.get_utm_campaigns(link, range_param)

        insights = InsightService.generate_insights(
            {
                "summary": summary,
                "countries": countries,
                "referrers": referrers,
                "devices": devices,
            }
        )
        anomalies = AnomalyDetectionService.detect(timeline)

        return {
            "link": {
                "id": str(link.id),
                "short_code": link.short_code,
                "original_url": link.original_url,
                "title": link.title,
                "created_at": link.created_at.isoformat(),
            },
            "summary": summary,
            "timeline": timeline,
            "countries": countries,
            "devices": devices,
            "browsers": browsers,
            "operating_systems": os_list,
            "referrers": referrers,
            "utm_sources": utm_sources,
            "utm_campaigns": utm_campaigns,
            "insights": insights,
            "anomalies": anomalies,
        }

    @classmethod
    def get_campaign_analytics(cls, campaign) -> dict:
        links = campaign.short_links.all()
        total_links = links.count()
        total_clicks = sum(link.click_count for link in links)

        clicks_qs = ClickEvent.objects.filter(short_link__campaign=campaign)
        unique_visitors = (
            clicks_qs.values("visitor_id").filter(~Q(visitor_id="")).distinct().count()
        )

        top_referrers = (
            clicks_qs.values("referrer_domain")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:5]
        )

        return {
            "campaign_id": str(campaign.id),
            "campaign_name": campaign.name,
            "total_links": total_links,
            "total_clicks": total_clicks,
            "unique_visitors": unique_visitors,
            "top_referrers": [
                {"source": r["referrer_domain"], "clicks": r["clicks"]}
                for r in top_referrers
            ],
        }


class InsightService:
    """
    Deterministic Rule-based AI Insight generator (Section 40).
    Prepares system for future LLM integration without sending PII.
    """

    @staticmethod
    def generate_insights(analytics: dict) -> list:
        insights = []
        summary = analytics.get("summary", {})
        countries = analytics.get("countries", [])
        referrers = analytics.get("referrers", [])
        devices = analytics.get("devices", {}).get("percentages", {})

        if summary.get("total_clicks", 0) > 0:
            if referrers:
                top_ref = referrers[0]
                insights.append(
                    f"{top_ref['source']} generated {top_ref['clicks']} clicks, making it your top traffic source."
                )

            if countries:
                top_c = countries[0]
                insights.append(
                    f"Traffic from {top_c['country']} represents {top_c['percentage']}% of total visitors."
                )

            mobile_pct = devices.get("mobile", 0)
            if mobile_pct > 40:
                insights.append(
                    f"Mobile traffic accounts for {mobile_pct}% of total clicks."
                )

            bot_clicks = summary.get("bot_clicks", 0)
            total_clicks = summary.get("total_clicks", 1)
            bot_pct = round((bot_clicks / total_clicks) * 100, 1)
            if bot_pct > 15:
                insights.append(
                    f"Notice: {bot_pct}% of clicks were identified as bot/crawlers."
                )

        return insights


class AnomalyDetectionService:
    """
    Deterministic Anomaly Detection service (Section 41).
    Detects traffic spikes exceeding rolling averages.
    """

    @staticmethod
    def detect(timeline: list) -> list:
        if not timeline or len(timeline) < 3:
            return []

        clicks_list = [item.get("clicks", 0) for item in timeline]
        avg_clicks = sum(clicks_list) / len(clicks_list)

        anomalies = []
        threshold = max(10, avg_clicks * 2.5)

        for item in timeline:
            clicks = item.get("clicks", 0)
            if clicks > threshold:
                date_key = item.get("date") or item.get("timestamp")
                anomalies.append(
                    {
                        "period": date_key,
                        "clicks": clicks,
                        "average": round(avg_clicks, 1),
                        "type": "traffic_spike",
                        "message": f"Unusual traffic spike detected: {clicks} clicks (average is {round(avg_clicks, 1)}).",
                    }
                )

        return anomalies
