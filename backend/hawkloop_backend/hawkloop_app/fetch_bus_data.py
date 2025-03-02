import requests
from django.core.management.base import BaseCommand
from hawkloop_app.models import BusLocation
from django.contrib.gis.geos import Point
from datetime import datetime

PASSIO_API_URL = "https://api.passiogo.com/live_data"  # Replace with actual API URL

class Command(BaseCommand):
    help = "Fetch live bus data from PassioGo API and update database"

    def handle(self, *args, **kwargs):
        response = requests.get(PASSIO_API_URL)
        if response.status_code == 200:
            data = response.json()
            for bus in data["buses"]:
                BusLocation.objects.update_or_create(
                    bus_id=bus["id"],
                    defaults={
                        "route_id": bus["route_id"],
                        "latitude": bus["lat"],
                        "longitude": bus["lng"],
                        "timestamp": datetime.utcnow(),
                        "location": Point(bus["lng"], bus["lat"]),
                    }
                )
            self.stdout.write(self.style.SUCCESS("Successfully updated bus locations"))
        else:
            self.stdout.write(self.style.ERROR("Failed to fetch bus data"))
