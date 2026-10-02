import logging
import uuid

from apps.tracking.tasks import process_click_event_task

logger = logging.getLogger("linkpulse")


class ClickTrackingService:
    @staticmethod
    def get_or_create_visitor_id(request) -> str:
        visitor_id = request.COOKIES.get("lp_vid")
        if not visitor_id:
            visitor_id = str(uuid.uuid4())
        return visitor_id

    @classmethod
    def record_click(cls, link, metadata: dict):
        try:
            # Enqueue Celery task asynchronously
            process_click_event_task.delay(str(link.id), metadata)
        except Exception as e:
            logger.warning(
                f"Celery enqueue failed for click event on {link.short_code}: {e}. "
                "Falling back to synchronous processing."
            )
            try:
                process_click_event_task.apply(args=[str(link.id), metadata])
            except Exception as sync_err:
                logger.error(
                    f"Synchronous fallback click processing failed: {sync_err}"
                )
