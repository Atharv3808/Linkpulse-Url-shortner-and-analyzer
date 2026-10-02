import io

import qrcode
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response

from apps.links.models import ShortLink
from apps.links.serializers import (
    CreateShortLinkSerializer,
    ShortLinkSerializer,
    UpdateShortLinkSerializer,
)
from apps.links.services import LinkService
from apps.workspaces.models import WorkspaceMember


class LinkViewSet(viewsets.ModelViewSet):
    serializer_class = ShortLinkSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["is_active", "workspace", "campaign"]
    search_fields = ["title", "original_url", "short_code"]
    ordering_fields = ["created_at", "click_count", "title"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        user_workspace_ids = WorkspaceMember.objects.filter(user=user).values_list(
            "workspace_id", flat=True
        )
        return ShortLink.objects.filter(
            workspace_id__in=user_workspace_ids
        ).select_related("workspace", "created_by", "campaign")

    @extend_schema(
        request=CreateShortLinkSerializer,
        responses={201: ShortLinkSerializer},
        summary="Create a new short link",
    )
    def create(self, request, *args, **kwargs):
        serializer = CreateShortLinkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        link = LinkService.create_link(
            user=request.user,
            original_url=serializer.validated_data["original_url"],
            title=serializer.validated_data.get("title", ""),
            custom_alias=serializer.validated_data.get("custom_alias", ""),
            workspace_id=serializer.validated_data.get("workspace_id"),
            campaign_id=serializer.validated_data.get("campaign_id"),
            expires_at=serializer.validated_data.get("expires_at"),
        )

        response_serializer = ShortLinkSerializer(link, context={"request": request})
        return Response(
            {"success": True, "data": response_serializer.data},
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        request=UpdateShortLinkSerializer,
        responses={200: ShortLinkSerializer},
        summary="Update short link",
    )
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UpdateShortLinkSerializer(
            instance, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        updated_link = LinkService.update_link(instance, **serializer.validated_data)
        response_serializer = ShortLinkSerializer(
            updated_link, context={"request": request}
        )
        return Response({"success": True, "data": response_serializer.data})

    @extend_schema(summary="Soft delete (disable) a short link")
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        LinkService.soft_delete_link(instance)
        return Response(
            {"success": True, "data": {"message": "Short link disabled successfully."}},
            status=status.HTTP_200_OK,
        )

    @extend_schema(summary="Generate QR code for a short link")
    @action(detail=True, methods=["get"], url_path="qr")
    def qr_code(self, request, pk=None):
        link = self.get_object()
        short_url = link.get_short_url(request.build_absolute_uri("/").rstrip("/"))

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(short_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        return HttpResponse(buffer.getvalue(), content_type="image/png")
