from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response

from apps.analytics.services import AnalyticsService
from apps.campaigns.models import Campaign
from apps.campaigns.serializers import CampaignSerializer, CreateCampaignSerializer
from apps.campaigns.services import CampaignService
from apps.workspaces.models import WorkspaceMember


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["workspace"]
    search_fields = ["name", "description"]
    ordering_fields = ["created_at", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        user_workspace_ids = WorkspaceMember.objects.filter(user=user).values_list(
            "workspace_id", flat=True
        )
        return Campaign.objects.filter(
            workspace_id__in=user_workspace_ids
        ).select_related("workspace")

    @extend_schema(
        request=CreateCampaignSerializer,
        responses={201: CampaignSerializer},
        summary="Create campaign",
    )
    def create(self, request, *args, **kwargs):
        serializer = CreateCampaignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        campaign = CampaignService.create_campaign(
            user=request.user,
            name=serializer.validated_data["name"],
            description=serializer.validated_data.get("description", ""),
            workspace_id=serializer.validated_data.get("workspace_id"),
            start_date=serializer.validated_data.get("start_date"),
            end_date=serializer.validated_data.get("end_date"),
        )
        return Response(
            {"success": True, "data": CampaignSerializer(campaign).data},
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(summary="Get campaign analytics breakdown")
    @action(detail=True, methods=["get"], url_path="analytics")
    def analytics(self, request, pk=None):
        campaign = self.get_object()
        data = AnalyticsService.get_campaign_analytics(campaign)
        return Response({"success": True, "data": data})
