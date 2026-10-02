from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AuthAnonRateThrottle(AnonRateThrottle):
    scope = "auth_anon"
    rate = "10/minute"


class LinkCreateRateThrottle(UserRateThrottle):
    scope = "link_create"
    rate = "60/minute"


class AnalyticsRateThrottle(UserRateThrottle):
    scope = "user"
    rate = "120/minute"
