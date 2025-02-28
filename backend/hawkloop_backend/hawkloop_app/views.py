from djangorestframework import viewsets
from .models import Route, Stop, Vehicle, Alert
from .serializer import RouteSerializer, StopSerializer, VehicleSerializer, AlertSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

# Similarly, create viewsets for Stop, Vehicle, and Alert

