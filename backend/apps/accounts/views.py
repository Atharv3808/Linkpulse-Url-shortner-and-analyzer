from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.serializers import (
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserSerializer,
)
from apps.accounts.services import AuthService
from apps.common.throttling import AuthAnonRateThrottle


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthAnonRateThrottle]

    @extend_schema(
        request=RegisterSerializer,
        responses={201: UserSerializer},
        summary="Register a new user and create default workspace",
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = AuthService.register_user(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data.get("first_name", ""),
            last_name=serializer.validated_data.get("last_name", ""),
            workspace_name=serializer.validated_data.get("workspace_name", ""),
        )

        user_data = UserSerializer(result["user"]).data

        return Response(
            {
                "success": True,
                "data": {
                    "user": user_data,
                    "workspace": {
                        "id": str(result["workspace"].id),
                        "name": result["workspace"].name,
                        "slug": result["workspace"].slug,
                    },
                    "tokens": result["tokens"],
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthAnonRateThrottle]

    @extend_schema(
        request=LoginSerializer,
        summary="Authenticate user and get JWT tokens",
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = AuthService.login_user(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        user_data = UserSerializer(result["user"]).data

        return Response(
            {
                "success": True,
                "data": {
                    "user": user_data,
                    "tokens": result["tokens"],
                },
            }
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: UserSerializer},
        summary="Get currently authenticated user details",
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=LogoutSerializer,
        summary="Log out user",
    )
    def post(self, request):
        return Response(
            {
                "success": True,
                "data": {"message": "Successfully logged out."},
            }
        )
