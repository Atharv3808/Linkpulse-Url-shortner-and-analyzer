from django.contrib import admin
from django.core.cache import cache
from django.db import connection
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from apps.tracking.views import RedirectView


def health_check(request):
    return JsonResponse({"status": "ok", "service": "linkpulse-backend"})


def health_ready(request):
    db_ok = False
    redis_ok = False

    # Verify PostgreSQL connection
    try:
        connection.ensure_connection()
        db_ok = True
    except Exception:
        db_ok = False

    # Verify Cache connection
    try:
        cache.set("health_check_ping", "pong", 5)
        redis_ok = cache.get("health_check_ping") == "pong"
    except Exception:
        redis_ok = False

    status_code = 200 if (db_ok and redis_ok) else 503

    return JsonResponse(
        {
            "status": "ok" if (db_ok and redis_ok) else "degraded",
            "database": "ok" if db_ok else "error",
            "cache": "ok" if redis_ok else "error",
        },
        status=status_code,
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    # Health checks
    path("health/", health_check, name="health-check"),
    path("health/ready/", health_ready, name="health-ready"),
    # OpenAPI Schema & Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # API v1 Endpoints
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/workspaces/", include("apps.workspaces.urls")),
    path("api/v1/links/", include("apps.links.urls")),
    path("api/v1/campaigns/", include("apps.campaigns.urls")),
    path("api/v1/analytics/", include("apps.analytics.urls")),
    # Public Short Link Redirect Engine (must be at root)
    path("<str:short_code>", RedirectView.as_view(), name="short-link-redirect"),
]
