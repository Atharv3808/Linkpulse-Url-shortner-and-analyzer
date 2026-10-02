import logging

from celery import shared_task
from django.db import transaction
from django.db.models import F
from django.utils import timezone

logger = logging.getLogger("linkpulse")


@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def process_click_event_task(self, link_id: str, metadata: dict):
    from apps.analytics.models import DailyLinkStats
    from apps.links.models import ShortLink
    from apps.tracking.models import ClickEvent
    from apps.tracking.parsers import GeoIPService, UserAgentParser

    try:
        try:
            link = ShortLink.objects.get(id=link_id)
        except ShortLink.DoesNotExist:
            logger.error(
                f"ShortLink with ID {link_id} not found during click processing."
            )
            return

        event_id = metadata.get("event_id")

        # Idempotency check: Ignore duplicate task processing attempts
        if event_id and ClickEvent.objects.filter(event_id=event_id).exists():
            logger.info(f"Duplicate click event task ignored for event_id: {event_id}")
            return

        # 1. Parse User Agent
        ua_data = UserAgentParser.parse(metadata.get("user_agent", ""))

        # 2. GeoIP lookup (use pre-parsed geo_data or fallback)
        geo_data = metadata.get("geo_data") or GeoIPService.lookup(
            metadata.get("ip", "")
        )

        # 3. Create ClickEvent
        click_event = ClickEvent.objects.create(
            short_link=link,
            event_id=event_id,
            visitor_id=metadata.get("visitor_id", ""),
            ip_hash=metadata.get("ip_hash", ""),
            country=geo_data.get("country"),
            region=geo_data.get("region"),
            city=geo_data.get("city"),
            latitude=geo_data.get("latitude"),
            longitude=geo_data.get("longitude"),
            device_type=ua_data.get("device_type", "unknown"),
            browser=ua_data.get("browser", "unknown"),
            browser_version=ua_data.get("browser_version", ""),
            os=ua_data.get("os", "unknown"),
            os_version=ua_data.get("os_version", ""),
            user_agent=metadata.get("user_agent", ""),
            referrer=metadata.get("referrer", ""),
            referrer_domain=metadata.get("referrer_domain", "direct"),
            utm_source=metadata.get("utm_source", ""),
            utm_medium=metadata.get("utm_medium", ""),
            utm_campaign=metadata.get("utm_campaign", ""),
            utm_term=metadata.get("utm_term", ""),
            utm_content=metadata.get("utm_content", ""),
            is_bot=ua_data.get("is_bot", False),
            bot_name=ua_data.get("bot_name", ""),
            language=metadata.get("language", ""),
            response_status=302,
        )

        # 4. Update Daily Analytics Aggregates (Section 21)
        today = timezone.now().date()
        device = ua_data.get("device_type", "desktop")

        with transaction.atomic():
            stats, created = DailyLinkStats.objects.get_or_create(
                short_link=link,
                date=today,
                defaults={
                    "total_clicks": 0,
                    "unique_visitors": 0,
                    "bot_clicks": 0,
                    "mobile_clicks": 0,
                    "desktop_clicks": 0,
                    "tablet_clicks": 0,
                },
            )

            is_bot = ua_data.get("is_bot", False)

            # Atomic increment
            updates = {"total_clicks": F("total_clicks") + 1}
            if is_bot:
                updates["bot_clicks"] = F("bot_clicks") + 1

            if device == "mobile":
                updates["mobile_clicks"] = F("mobile_clicks") + 1
            elif device == "tablet":
                updates["tablet_clicks"] = F("tablet_clicks") + 1
            elif device == "desktop":
                updates["desktop_clicks"] = F("desktop_clicks") + 1

            DailyLinkStats.objects.filter(pk=stats.pk).update(**updates)

        logger.info(
            f"Processed click event for short code '{link.short_code}' (ID: {click_event.id})"
        )

    except Exception as exc:
        logger.exception(f"Error processing click event for link {link_id}: {exc}")
        raise self.retry(exc=exc) from exc
