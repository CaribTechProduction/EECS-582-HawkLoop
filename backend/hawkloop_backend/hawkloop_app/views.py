from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.response import Response
import passiogo
from rest_framework.views import APIView
import passiogo
from .models import BusLocation
from .models import Route, Stop, Vehicle, Alert
from .serializers import RouteSerializer, StopSerializer, VehicleSerializer, AlertSerializer


class RouteViewSet(viewsets.ViewSet):
    def list(self, request):
        def fetch_routes():
            queryset = Route.objects.all()
            serializer = RouteSerializer(queryset, many=True)
            return serializer.data

        # Estimate runtime for fetching routes
        #result = estimate_runtime(fetch_routes)
        #return Response(result)


class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer


class VehicleViewSet(viewsets.ViewSet):
    def list(self, request):
        def fetch_vehicle_data():
            # Check if vehicle data is cached in Redis
            cached_data = cache.get("bus_locations")

            if cached_data:
                return cached_data  # Return cached data if available

            # If not cached, fetch live data from Passio GO
            system = passiogo.getSystemFromID(4834)
            vehicles = system.getVehicles()

            # Format the data (without latitude)
            data = [
                {
                    "vehicle_id": v.id,
                    "longitude": v.longitude,
                    "calculatedCourse": v.calculatedCourse,
                    "route_id": v.routeId,
                    "trip_id": v.tripId,
                    "speed": v.speed,
                    "outOfService": v.outOfService,
                }
                for v in vehicles
            ]

            # Store the data in Redis for 30 seconds
            cache.set("bus_locations", data, timeout=30)
            return data

        # Estimate runtime for fetching vehicle data
        # result = estimate_runtime(fetch_vehicle_data)
        # return Response(result)


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer


class LiveBusLocationView(APIView):
    def get(self, request):
        bus_data = BusLocation.objects.values("bus_id", "route_id", "latitude", "longitude", "timestamp")
        return Response({"buses": list(bus_data)}, status=status.HTTP_200_OK)