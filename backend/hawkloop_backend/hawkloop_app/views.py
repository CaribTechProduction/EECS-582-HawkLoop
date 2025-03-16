from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.response import Response
import passiogo
from rest_framework.views import APIView
import passiogo_up
#from .models import BusLocation
from .models import Route, Stop, Vehicle, Alert
from .serializers import RouteSerializer, StopSerializer, VehicleSerializer, AlertSerializer


class RouteViewSet(viewsets.ViewSet):
    def list(self, request):
        # def fetch_routes():
            
        queryset = Route.objects.all()
        serializer = RouteSerializer(queryset, many=True)
        return Response(serializer.data, status=200)  

        # Estimate runtime for fetching routes
        #result = estimate_runtime(fetch_routes)
        #return Response(result)


class StopViewSet(viewsets.ViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    # Fetch live vehicle data from PassioGo API
        

class VehicleViewSet(viewsets.ViewSet):
    def list(self, request):
        """
        Fetch and return all active vehicle details from the PassioGo API.
        Caches data for 30 seconds to reduce API calls.
        """
        # Check if vehicle data is cached in Redis
        # cached_data = cache.get("bus_locations")

        #if cached_data:
            #return Response(cached_data)

        # Fetch live vehicle data from PassioGo API
        system = passiogo_up.getSystemFromID(4834)  
        vehicles = system.getVehicles()

        # Format data to return
        data = [
            {
                "vehicle_id": v.id,
                "longitude": v.longitude,
                "latitude": v.latitude,
                "route_id": v.routeId,
                "trip_id": v.tripId,
                "speed": v.speed,
                "outOfService": v.outOfService,
            }
            for v in vehicles
        ]

        # Cache the data for 30 seconds
        # cache.set("bus_locations", data, timeout=30)
        return Response(data)

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer


# class LiveBusLocationView(APIView):
#     def get(self, request):
#         bus_data = BusLocation.objects.values("bus_id", "route_id", "latitude", "longitude", "timestamp")
#         return Response({"buses": list(bus_data)}, status=status.HTTP_200_OK)