from django.core.management.base import BaseCommand
from django.core.cache import cache
import passiogo
from hawkloop_app.models import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Command(BaseCommand):
    help = "Update bus data from Passio GO API"

    def handle(self, *args, **kwargs):
        try:
            # Connect to the Passio GO system using SYSTEM_ID
            system = passiogo.getSystemFromID(4834)

            #### UPDATE ROUTES #####
            self.stdout.write("Fetching routes from Passio GO API...")
            routes = system.getRoutes()
            for route in routes:
                Route.objects.update_or_create(
                    route_id=route.id,
                    defaults={'name': route.name}
                )
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(routes)} routes."))

            ### UPDATE STOPS ####
            self.stdout.write("Fetching stops from Passio GO API...")
            stops = system.getStops()
            for stop in stops:
                Stop.objects.update_or_create(
                    stop_id=stop.id,
                    defaults={'name': stop.name, 'latitude': stop.latitude, 'longitude': stop.longitude}
                )
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(stops)} stops."))

            ##### UPDATE VEHICLES #####
            self.stdout.write("Fetching vehicles from Passio GO API...")
            vehicles = system.getVehicles()
            
            vehicle_data = [] #Empy array to store the vehicle data.
            for vehicle in vehicles:
                # Save location to the database (new entry for each update)
                # VehicleLocation.objects.create(
                #     vehicle_id=vehicle.id,
                #     latitude=vehicle.latitude,
                #     longitude=vehicle.longitude
                # )
                
                # Format data for Redis caching
                vehicle_data.append({
                    "vehicle_id": vehicle.id,
                    "longitude": vehicle.longitude,
                    "latitude": vehicle.latitude,
                    "route_id": vehicle.routeId,
                    "trip_id": vehicle.tripId,
                    "speed": vehicle.speed,
                    "outOfService": vehicle.outOfService,
                })

            # Cache data in Redis for fast retrieval (30 seconds)
            cache.set("bus_locations", vehicle_data, timeout=30)
              
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "vehicles",
                {
                    "type": "vehicle.update",
                    "data": vehicle_data,
                }
            )  
                
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(vehicles)} vehicle Locations."))

            #### UPDATE ALERTS #####
            # self.stdout.write("Fetching alerts from Passio GO API...")
            # alerts = system.getAlerts()
            # for alert in alerts:
            #     Alert.objects.update_or_create(
            #         alert_id=alert.id,
            #         defaults={'message': alert.message, 'start_time': alert.startTime, 'end_time': alert.endTime}
            #     )
            # self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(alerts)} alerts."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error updating data: {e}"))
