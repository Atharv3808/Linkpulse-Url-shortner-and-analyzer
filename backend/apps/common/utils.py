import hashlib
import secrets
import string
from urllib.parse import urlparse

from django.conf import settings


def hash_ip(ip_address: str) -> str:
    """
    Hashes IP address with a server-side salt using SHA-256.
    Ensures visitor privacy by avoiding raw IP storage.
    """
    if not ip_address:
        return ""
    salt = getattr(settings, "IP_HASH_SALT", "linkpulse-default-salt")
    salted = f"{ip_address}:{salt}".encode("utf-8")
    return hashlib.sha256(salted).hexdigest()


def generate_short_code(length: int = 6) -> str:
    """
    Generates a cryptographically secure random short code.
    Uses URL-safe alphanumeric characters.
    """
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def extract_referrer_domain(referrer_url: str) -> str:
    """
    Extracts normalized domain name from a referrer URL.
    Returns 'direct' if missing or empty.
    """
    if not referrer_url or referrer_url.strip() in ("", "direct"):
        return "direct"

    try:
        parsed = urlparse(referrer_url)
        domain = parsed.netloc or parsed.path
        domain = domain.split(":")[0].lower()
        if domain.startswith("www."):
            domain = domain[4:]
        return domain if domain else "direct"
    except Exception:
        return "direct"
