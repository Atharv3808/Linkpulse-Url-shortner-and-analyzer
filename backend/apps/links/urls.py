from rest_framework.routers import DefaultRouter

from apps.links.views import LinkViewSet

router = DefaultRouter()
router.register(r"", LinkViewSet, basename="link")

urlpatterns = router.urls
