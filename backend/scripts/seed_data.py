import os
import random
import sys
import uuid
from datetime import timedelta

from django.db import transaction
from django.utils import timezone

# Setup django environment if executed standalone
if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sys.path.insert(
        0,
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "apps"
        ),
    )
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
    import django

    django.setup()

from django.contrib.auth import get_user_model

from apps.analytics.models import DailyLinkStats
from apps.campaigns.models import Campaign
from apps.links.models import ShortLink
from apps.tracking.models import ClickEvent
from apps.workspaces.models import Workspace, WorkspaceMember

User = get_user_model()

COUNTRIES = [
    ("United States", "US"),
    ("India", "IN"),
    ("Germany", "DE"),
    ("United Kingdom", "GB"),
    ("Canada", "CA"),
    ("France", "FR"),
    ("Japan", "JP"),
    ("Australia", "AU"),
    ("Brazil", "BR"),
]

REFERRERS = [
    ("https://www.linkedin.com/feed/", "linkedin.com"),
    ("https://www.google.com/search?q=linkpulse", "google.com"),
    ("https://twitter.com/user/status/123", "twitter.com"),
    ("https://github.com/linkpulse/backend", "github.com"),
    ("https://t.co/xyz123", "t.co"),
    ("", "direct"),
    ("direct", "direct"),
]

DEVICES = [
    ("desktop", "Chrome", "122.0", "macOS", "14.2"),
    ("desktop", "Firefox", "121.0", "Windows", "11"),
    ("desktop", "Edge", "120.0", "Windows", "10"),
    ("mobile", "Safari", "17.1", "iOS", "17.2"),
    ("mobile", "Chrome", "121.0", "Android", "14"),
    ("tablet", "Safari", "17.0", "iOS", "17.0"),
    ("bot", "Googlebot", "2.1", "Linux", ""),
    ("bot", "Slackbot", "1.0", "Linux", ""),
]

UTMS = [
    ("linkedin", "social", "launch2026"),
    ("google", "cpc", "search_brand"),
    ("newsletter", "email", "weekly_digest"),
    ("twitter", "social", "product_update"),
    ("", "", ""),
]


@transaction.atomic
def run_seed():
    print("🌱 Starting LinkPulse Seed Process...")

    # 1. Users
    user1, _ = User.objects.get_or_create(
        email="demo@linkpulse.app",
        defaults={
            "first_name": "Demo",
            "last_name": "User",
            "is_staff": True,
            "is_superuser": True,
        },
    )
    user1.set_password("password123")
    user1.save()

    user2, _ = User.objects.get_or_create(
        email="john@linkpulse.app",
        defaults={"first_name": "John", "last_name": "Doe"},
    )
    user2.set_password("password123")
    user2.save()

    print(f"✅ Created users: {user1.email}, {user2.email}")

    # 2. Workspaces
    ws1, _ = Workspace.objects.get_or_create(
        slug="linkpulse-main",
        defaults={"name": "LinkPulse Main", "owner": user1},
    )
    WorkspaceMember.objects.get_or_create(
        workspace=ws1, user=user1, defaults={"role": WorkspaceMember.Role.OWNER}
    )

    ws2, _ = Workspace.objects.get_or_create(
        slug="acme-marketing",
        defaults={"name": "Acme Marketing", "owner": user2},
    )
    WorkspaceMember.objects.get_or_create(
        workspace=ws2, user=user2, defaults={"role": WorkspaceMember.Role.OWNER}
    )
    WorkspaceMember.objects.get_or_create(
        workspace=ws1, user=user2, defaults={"role": WorkspaceMember.Role.MEMBER}
    )

    print(f"✅ Created workspaces: {ws1.name}, {ws2.name}")

    # 3. Campaigns
    cmp1, _ = Campaign.objects.get_or_create(
        workspace=ws1,
        slug="q1-launch",
        defaults={
            "name": "Q1 2026 Launch",
            "created_by": user1,
            "description": "Q1 product launch campaign",
        },
    )
    print(f"✅ Created campaign: {cmp1.name}")

    # 4. Links
    links_data = [
        (
            "launch2026",
            "https://example.com/product-launch",
            "Q1 Product Launch Page",
            ws1,
            cmp1,
        ),
        (
            "docs",
            "https://docs.linkpulse.app/getting-started",
            "Developer Documentation",
            ws1,
            None,
        ),
        (
            "blog-post",
            "https://blog.linkpulse.app/announcing-v1",
            "V1 Launch Announcement",
            ws1,
            cmp1,
        ),
        ("pricing", "https://example.com/pricing", "SaaS Pricing Tiers", ws1, None),
        (
            "demo-video",
            "https://youtube.com/watch?v=demo123",
            "Product Demo Video",
            ws1,
            cmp1,
        ),
        (
            "acme-offer",
            "https://acme.com/special-offer",
            "Acme Special Discount",
            ws2,
            None,
        ),
        (
            "acme-webinar",
            "https://acme.com/webinar",
            "Acme Masterclass Webinar",
            ws2,
            None,
        ),
    ]

    links = []
    for code, original_url, title, workspace, campaign in links_data:
        link, _ = ShortLink.objects.get_or_create(
            short_code=code,
            defaults={
                "workspace": workspace,
                "created_by": user1 if workspace == ws1 else user2,
                "campaign": campaign,
                "original_url": original_url,
                "title": title,
            },
        )
        links.append(link)

    print(f"✅ Created {len(links)} short links.")

    # 5. Generate Click Events & Daily Stats over the past 30 days
    now = timezone.now()
    total_events_created = 0

    visitor_pool = [str(uuid.uuid4()) for _ in range(250)]

    for link in links:
        link_events = 0

        for days_ago in range(30, -1, -1):
            date_target = (now - timedelta(days=days_ago)).date()
            daily_clicks_count = random.randint(15, 60)

            stats, _ = DailyLinkStats.objects.get_or_create(
                short_link=link,
                date=date_target,
                defaults={
                    "total_clicks": 0,
                    "unique_visitors": 0,
                    "bot_clicks": 0,
                    "mobile_clicks": 0,
                    "desktop_clicks": 0,
                    "tablet_clicks": 0,
                },
            )

            daily_bots = 0
            daily_mobiles = 0
            daily_desktops = 0
            daily_tablets = 0

            for _ in range(daily_clicks_count):
                ts = now - timedelta(
                    days=days_ago,
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59),
                )
                country, iso = random.choice(COUNTRIES)
                ref_url, ref_domain = random.choice(REFERRERS)
                dtype, browser, bver, os_name, osver = random.choice(DEVICES)
                utm_src, utm_med, utm_cmp = random.choice(UTMS)
                visitor = random.choice(visitor_pool)

                is_bot = dtype == "bot"
                bot_name = browser if is_bot else ""

                if is_bot:
                    daily_bots += 1
                elif dtype == "mobile":
                    daily_mobiles += 1
                elif dtype == "tablet":
                    daily_tablets += 1
                else:
                    daily_desktops += 1

                ClickEvent.objects.create(
                    short_link=link,
                    timestamp=ts,
                    visitor_id=visitor,
                    ip_hash=f"hash_{random.randint(1000,9999)}",
                    country=country,
                    region="State",
                    city="City",
                    device_type=dtype,
                    browser=browser,
                    browser_version=bver,
                    os=os_name,
                    os_version=osver,
                    user_agent="Mozilla/5.0 (Fake User Agent)",
                    referrer=ref_url,
                    referrer_domain=ref_domain,
                    utm_source=utm_src,
                    utm_medium=utm_med,
                    utm_campaign=utm_cmp,
                    is_bot=is_bot,
                    bot_name=bot_name,
                )
                link_events += 1

            # Update daily stats
            stats.total_clicks += daily_clicks_count
            stats.bot_clicks += daily_bots
            stats.mobile_clicks += daily_mobiles
            stats.desktop_clicks += daily_desktops
            stats.tablet_clicks += daily_tablets
            stats.save()

        # Update link click count
        link.click_count = link_events
        link.save()

        total_events_created += link_events

    print(
        f"✅ Generated {total_events_created} fake click events with daily aggregate stats!"
    )
    print("🚀 Seed completed successfully!")


if __name__ == "__main__":
    run_seed()
