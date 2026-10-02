from django.core.management.base import BaseCommand

from scripts.seed_data import run_seed


class Command(BaseCommand):
    help = (
        "Seeds database with realistic demo users, workspaces, links, and click events."
    )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting LinkPulse seed data command..."))
        run_seed()
        self.stdout.write(self.style.SUCCESS("LinkPulse seed data command completed!"))
