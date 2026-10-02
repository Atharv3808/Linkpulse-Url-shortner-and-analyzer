import re
from urllib.parse import urlparse

from apps.common.constants import RESERVED_SHORT_CODES
from apps.common.exceptions import CustomAliasTaken, InvalidDestinationURL


def validate_destination_url(url: str) -> str:
    """
    Validates original URL scheme. Only http and https are allowed.
    Rejects javascript:, data:, file:, ftp:.
    """
    if not url:
        raise InvalidDestinationURL("Destination URL cannot be empty.")

    parsed = urlparse(url.strip())
    if parsed.scheme.lower() not in ("http", "https"):
        raise InvalidDestinationURL(
            f"Invalid URL scheme '{parsed.scheme}'. Only 'http' and 'https' are allowed."
        )

    if not parsed.netloc:
        raise InvalidDestinationURL("Invalid URL structure: missing domain.")

    return url.strip()


def validate_custom_alias(alias: str) -> str:
    """
    Validates custom alias format and reserved keywords.
    3-32 characters, alphanumeric, hyphen, underscore.
    """
    if not alias:
        return ""

    alias_clean = alias.strip().lower()

    if len(alias_clean) < 3 or len(alias_clean) > 32:
        raise CustomAliasTaken("Custom alias must be between 3 and 32 characters.")

    if not re.match(r"^[a-zA-Z0-9_-]+$", alias_clean):
        raise CustomAliasTaken(
            "Custom alias can only contain letters, numbers, hyphens, and underscores."
        )

    if alias_clean in RESERVED_SHORT_CODES:
        raise CustomAliasTaken(
            f"The short code '{alias_clean}' is reserved and cannot be used."
        )

    return alias_clean
