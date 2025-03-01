from rest_framework import viewsets
from rest_framework.response import Response
import passiogo
from .models import Route, Stop, Vehicle, Alert
from .serializers import RouteSerializer, StopSerializer, VehicleSerializer, AlertSerializer


class RouteViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Route.objects.all()
        serializer_class = RouteSerializer

# Similarly, create viewsets for Stop, Vehicle, and Alert
class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    
class VehicleViewSet(viewsets.ViewSet):
    def list(self, request):
        system = passiogo.getSystemFromID(4834)
        vehicles = system.getVehicles()  # Fetch live vehicle data

        # Format the response
        data = [
            {"vehicle_id": v.id, "longitude": v.longitude, "Lat": v.calculatedCourse, "route_id": v.routeId}
            for v in vehicles
        ]
        return Response(data)
    
class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
