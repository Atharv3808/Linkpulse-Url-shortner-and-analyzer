from apps.common.utils import extract_referrer_domain, hash_ip
from apps.tracking.parsers import GeoIPService, UserAgentParser


class TestTrackingUnit:
    def test_ip_hashing_privacy(self):
        ip = "192.168.1.100"
        hashed = hash_ip(ip)
        assert hashed != ip
        assert len(hashed) == 64  # SHA-256 hex string
        # Same IP yields deterministic hash
        assert hash_ip(ip) == hashed

    def test_extract_referrer_domain(self):
        assert (
            extract_referrer_domain("https://www.linkedin.com/feed/post/123")
            == "linkedin.com"
        )
        assert (
            extract_referrer_domain("https://google.com/search?q=test") == "google.com"
        )
        assert extract_referrer_domain("") == "direct"
        assert extract_referrer_domain(None) == "direct"

    def test_user_agent_bot_detection(self):
        googlebot_ua = (
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
        )
        result = UserAgentParser.parse(googlebot_ua)
        assert result["is_bot"] is True
        assert result["device_type"] == "bot"
        assert result["bot_name"] == "Googlebot"

        curl_ua = "curl/7.68.0"
        curl_result = UserAgentParser.parse(curl_ua)
        assert curl_result["is_bot"] is True

        chrome_ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        chrome_result = UserAgentParser.parse(chrome_ua)
        assert chrome_result["is_bot"] is False
        assert chrome_result["device_type"] == "desktop"
        assert chrome_result["browser"] == "Chrome"

    def test_geoip_service_missing_db_fallback(self):
        # Should gracefully return empty dict without throwing exception
        res = GeoIPService.lookup("8.8.8.8")
        assert "country" in res
        assert "region" in res
        assert "city" in res
