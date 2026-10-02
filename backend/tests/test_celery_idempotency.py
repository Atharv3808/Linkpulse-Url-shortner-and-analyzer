import uuid

import pytest

from apps.analytics.models import DailyLinkStats
from apps.links.models import ShortLink
from apps.tracking.models import ClickEvent
from apps.tracking.tasks import process_click_event_task


@pytest.mark.django_db
class TestCeleryIdempotency:
    def test_duplicate_task_idempotency(self, workspace):
        link = ShortLink.objects.create(
            workspace=workspace,
            short_code="idempotent1",
            original_url="https://example.com/idem",
        )
        event_id = str(uuid.uuid4())
        metadata = {
            "event_id": event_id,
            "visitor_id": "visitor-123",
            "ip_hash": "hash123",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "referrer_domain": "google.com",
            "utm_source": "spring_sale",
        }

        # First task execution
        process_click_event_task(str(link.id), metadata)
        assert ClickEvent.objects.filter(event_id=event_id).count() == 1

        stats = DailyLinkStats.objects.get(short_link=link)
        assert stats.total_clicks == 1

        # Second duplicate task execution (e.g. Celery network retry)
        process_click_event_task(str(link.id), metadata)

        # Count must remain 1 (no duplicate ClickEvent created)
        assert ClickEvent.objects.filter(event_id=event_id).count() == 1
        stats.refresh_from_db()
        assert stats.total_clicks == 1
