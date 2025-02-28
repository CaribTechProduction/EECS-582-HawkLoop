from django.core.management.base import BaseCommand
import passiogo
from hawkloop_app.models import Route, Stop, Vehicle, Alert


class Command(BaseCommand):
    help = 'Update bus data from Passio GO API'

    def handle(self, *args, **kwargs):
        system = passiogo.getSystemFromID(YOUR_SYSTEM_ID = 4834)

        # Update Routes
        routes = system.getRoutes()
        for route in routes:
            Route.objects.update_or_create(
                route_id=route.id,
                defaults={'name': route.name}
            )

        # Similarly, update Stops, Vehicles, and Alerts
