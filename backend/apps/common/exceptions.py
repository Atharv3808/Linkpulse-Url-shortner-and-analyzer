import logging

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger("linkpulse")


class LinkPulseException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "BAD_REQUEST"
    default_detail = "An error occurred."

    def __init__(self, detail=None, code=None, status_code=None, details=None):
        if status_code is not None:
            self.status_code = status_code
        if code is not None:
            self.default_code = code
        self.details = details or {}
        super().__init__(detail=detail or self.default_detail, code=code)


class InvalidShortCode(LinkPulseException):
    status_code = status.HTTP_404_NOT_FOUND
    default_code = "INVALID_SHORT_CODE"
    default_detail = "The requested short code does not exist."


class LinkExpired(LinkPulseException):
    status_code = status.HTTP_410_GONE
    default_code = "LINK_EXPIRED"
    default_detail = "This short link has expired."


class LinkDisabled(LinkPulseException):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "LINK_DISABLED"
    default_detail = "This short link is currently disabled."


class WorkspaceAccessDenied(LinkPulseException):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "WORKSPACE_ACCESS_DENIED"
    default_detail = "You do not have permission to access this workspace."


class CustomAliasTaken(LinkPulseException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "CUSTOM_ALIAS_TAKEN"
    default_detail = "This custom alias is already in use or reserved."


class InvalidDestinationURL(LinkPulseException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "INVALID_URL"
    default_detail = "The provided URL is invalid or uses an unsupported scheme."


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_code = getattr(exc, "default_code", getattr(exc, "code", "API_ERROR"))
        message = (
            str(exc.detail)
            if hasattr(exc, "detail") and isinstance(exc.detail, (str, list))
            else None
        )

        details = {}
        if isinstance(response.data, dict):
            if "detail" in response.data:
                message = str(response.data["detail"])
            else:
                details = response.data
                if not message:
                    message = "Validation failed or invalid payload."
        elif isinstance(response.data, list):
            details = {"errors": response.data}
            message = "Validation failed."

        if isinstance(error_code, str):
            error_code = error_code.upper()
        else:
            error_code = "VALIDATION_ERROR"

        custom_response_data = {
            "success": False,
            "error": {
                "code": error_code,
                "message": message or "An error occurred.",
                "details": details,
            },
        }

        response.data = custom_response_data
        return response

    # Handle unhandled server errors (500)
    logger.exception("Unhandled server exception: %s", exc)
    return Response(
        {
            "success": False,
            "error": {
                "code": "SERVER_ERROR",
                "message": "An unexpected server error occurred.",
                "details": {},
            },
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
