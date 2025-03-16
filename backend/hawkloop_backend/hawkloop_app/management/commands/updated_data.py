from django.core.management.base import BaseCommand
import passiogo_up
from hawkloop_app.models import Route, Stop, Vehicle, Alert

class Command(BaseCommand):
    help = "Update bus data from Passio GO API"

    def handle(self, *args, **kwargs):
        try:
            # Connect to the Passio GO system using SYSTEM_ID
            system = passiogo_up.getSystemFromID(4834)

            # Update Routes
            self.stdout.write("Fetching routes from Passio GO API...")
            routes = system.getRoutes()
            for route in routes:
                Route.objects.update_or_create(
                    route_id=route.id,
                    defaults={'name': route.name}
                )
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(routes)} routes."))

            # Update Stops
            self.stdout.write("Fetching stops from Passio GO API...")
            stops = system.getStops()
            for stop in stops:
                Stop.objects.update_or_create(
                    stop_id=stop.id,
                    defaults={'name': stop.name, 'latitude': stop.latitude, 'longitude': stop.longitude}
                )
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(stops)} stops."))

            # Update Vehicles
            self.stdout.write("Fetching vehicles from Passio GO API...")
            vehicles = system.getVehicles()
            for vehicle in vehicles:
                Vehicle.objects.update_or_create(
                    vehicle_id=vehicle.id,
                    defaults={'route_id': vehicle.routeID, 'latitude': vehicle.latitude, 'longitude': vehicle.longitude}
                )
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(vehicles)} vehicles."))

            # Update Alerts
            self.stdout.write("Fetching alerts from Passio GO API...")
            alerts = system.getAlerts()
            for alert in alerts:
                Alert.objects.update_or_create(
                    alert_id=alert.id,
                    defaults={'message': alert.message, 'start_time': alert.startTime, 'end_time': alert.endTime}
                )
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(alerts)} alerts."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error updating data: {e}"))
