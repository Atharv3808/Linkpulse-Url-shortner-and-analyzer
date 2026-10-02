import logging
import os
import re

from django.conf import settings
from user_agents import parse as parse_user_agent

from apps.common.utils import extract_referrer_domain, hash_ip

logger = logging.getLogger("linkpulse")


class GeoIPService:
    _reader = None

    @classmethod
    def _get_reader(cls):
        if cls._reader is None:
            db_path = getattr(settings, "GEOIP_DATABASE_PATH", "")
            if db_path and os.path.exists(db_path):
                try:
                    import geoip2.database

                    cls._reader = geoip2.database.Reader(db_path)
                except Exception as e:
                    logger.warning(f"Failed to initialize GeoIP reader: {e}")
                    cls._reader = False
            else:
                cls._reader = False
        return cls._reader if cls._reader is not False else None

    @classmethod
    def lookup(cls, ip_address: str) -> dict:
        result = {
            "country": None,
            "region": None,
            "city": None,
            "latitude": None,
            "longitude": None,
        }
        if not ip_address or ip_address in ("127.0.0.1", "localhost", "::1"):
            return result

        reader = cls._get_reader()
        if not reader:
            return result

        try:
            response = reader.city(ip_address)
            result["country"] = response.country.name or response.country.iso_code
            result["region"] = (
                response.subdivisions.most_specific.name
                if response.subdivisions
                else None
            )
            result["city"] = response.city.name
            result["latitude"] = response.location.latitude
            result["longitude"] = response.location.longitude
        except Exception as e:
            logger.debug(f"GeoIP lookup failed for IP {ip_address}: {e}")

        return result


BOT_PATTERNS = [
    (r"googlebot", "Googlebot"),
    (r"bingbot", "Bingbot"),
    (r"slurp", "Yahoo! Slurp"),
    (r"duckduckbot", "DuckDuckBot"),
    (r"baiduspider", "Baiduspider"),
    (r"yandexbot", "YandexBot"),
    (r"sogou", "Sogou"),
    (r"exabot", "Exabot"),
    (r"facebookexternalhit", "Facebook Bot"),
    (r"twitterbot", "Twitterbot"),
    (r"slackbot", "Slackbot"),
    (r"discordbot", "Discordbot"),
    (r"linkedinbot", "LinkedInBot"),
    (r"whatsapp", "WhatsApp Bot"),
    (r"telegrambot", "TelegramBot"),
    (r"applebot", "Applebot"),
    (r"curl", "curl"),
    (r"wget", "wget"),
    (r"python-requests", "python-requests"),
    (r"headlesschrome", "HeadlessChrome"),
    (r"postmanruntime", "Postman"),
    (r"httpx", "httpx"),
    (r"bot|crawler|spider|robot|crawling", "Generic Bot"),
]


class UserAgentParser:
    @staticmethod
    def parse(user_agent_string: str) -> dict:
        if not user_agent_string:
            return {
                "device_type": "unknown",
                "browser": "unknown",
                "browser_version": "",
                "os": "unknown",
                "os_version": "",
                "is_bot": False,
                "bot_name": "",
            }

        # Check bot patterns first
        is_bot = False
        bot_name = ""
        ua_lower = user_agent_string.lower()
        for pattern, name in BOT_PATTERNS:
            if re.search(pattern, ua_lower):
                is_bot = True
                bot_name = name
                break

        ua = parse_user_agent(user_agent_string)

        if ua.is_bot and not is_bot:
            is_bot = True
            bot_name = "Generic Bot"

        if is_bot:
            device_type = "bot"
        elif ua.is_mobile:
            device_type = "mobile"
        elif ua.is_tablet:
            device_type = "tablet"
        elif ua.is_pc:
            device_type = "desktop"
        else:
            device_type = "unknown"

        return {
            "device_type": device_type,
            "browser": ua.browser.family or "unknown",
            "browser_version": ua.browser.version_string or "",
            "os": ua.os.family or "unknown",
            "os_version": ua.os.version_string or "",
            "is_bot": is_bot,
            "bot_name": bot_name,
        }


class RequestMetadataExtractor:
    @staticmethod
    def extract_client_ip(request) -> str:
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR", "")
        return ip

    @classmethod
    def extract(cls, request) -> dict:
        ip = cls.extract_client_ip(request)
        ip_hashed = hash_ip(ip)

        # Look up GeoIP locally before dropping raw IP
        geo_data = GeoIPService.lookup(ip)

        user_agent_str = request.META.get("HTTP_USER_AGENT", "")
        referrer_str = request.META.get("HTTP_REFERER", "")

        referrer_domain = extract_referrer_domain(referrer_str)

        # Extract UTM query parameters
        params = request.GET
        utm_source = params.get("utm_source", "").strip()
        utm_medium = params.get("utm_medium", "").strip()
        utm_campaign = params.get("utm_campaign", "").strip()
        utm_term = params.get("utm_term", "").strip()
        utm_content = params.get("utm_content", "").strip()

        # Visitor ID from cookie
        visitor_id = request.COOKIES.get("lp_vid", "")

        return {
            "ip_hash": ip_hashed,
            "geo_data": geo_data,
            "user_agent": user_agent_str,
            "referrer": referrer_str,
            "referrer_domain": referrer_domain,
            "utm_source": utm_source,
            "utm_medium": utm_medium,
            "utm_campaign": utm_campaign,
            "utm_term": utm_term,
            "utm_content": utm_content,
            "visitor_id": visitor_id,
            "language": request.META.get("HTTP_ACCEPT_LANGUAGE", "")[:32],
        }
