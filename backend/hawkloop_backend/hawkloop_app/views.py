from django.core.cache import cache
from rest_framework import viewsets
from rest_framework.response import Response
import passiogo
from .models import Route, Stop, Vehicle, Alert
from .serializers import RouteSerializer, StopSerializer, VehicleSerializer, AlertSerializer


class RouteViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Route.objects.all()
        serializer_class = RouteSerializer


class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer


class VehicleViewSet(viewsets.ViewSet):
    def list(self, request):
        # Check if vehicle data is cached in Redis
        cached_data = cache.get("bus_locations")

        if cached_data:
            return Response(cached_data)  # Return cached data if available

        # If not cached, fetch live data from Passio GO
        system = passiogo.getSystemFromID(4834)
        vehicles = system.getVehicles()

        # Format the data
        data = [
            {"vehicle_id": v.id, "longitude": v.longitude, "latitude": v.latitude, "route_id": v.routeId}
            for v in vehicles
        ]

        # Store the data in Redis for 30 seconds
        cache.set("bus_locations", data, timeout=30)

        return Response(data)


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

