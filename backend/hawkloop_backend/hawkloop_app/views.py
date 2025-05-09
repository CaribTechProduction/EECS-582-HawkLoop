from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
import passiogo
from django.shortcuts import render
from .models import Route, Stop, Vehicle, Alert
from .serializers import RouteSerializer, StopSerializer, VehicleSerializer, AlertSerializer
from django.http import JsonResponse

def search(request):
    query = request.GET.get('query', '')
    search_type = request.GET.get('type', '')

    if not query or not search_type:
        return JsonResponse({"error": "Missing 'query' or 'type' parameter."}, status=400)

    results = []

    if search_type == 'stop':
        stops = Stop.objects.filter(name__icontains=query)
        results = [{"id": stop.stop_id, "name": stop.name} for stop in stops]
    elif search_type == 'route':
        routes = Route.objects.filter(name__icontains=query)
        results = [{"id": route.route_id, "name": route.name} for route in routes]
    else:
        return JsonResponse({"error": "Invalid search type. Must be 'stop' or 'route'."}, status=400)

    return JsonResponse(results, safe=False)


class RouteViewSet(viewsets.ViewSet):
    def list(self, request):
        # Check if routes are cached in Redis
        cached_routes = cache.get("routes")
        if cached_routes:
            return Response(cached_routes, status=200)  

        # Fetch routes from the database using Django ORM
        queryset = Route.objects.all()
        serializer = RouteSerializer(queryset, many=True)

        # Cache the results to avoid frequent DB queries
        cache.set("routes", serializer.data, timeout=3600)  # Cache for 1 hour

        return Response(serializer.data, status=200)  

        # Estimate runtime for fetching routes
        #result = estimate_runtime(fetch_routes)
        #return Response(result)


class StopViewSet(viewsets.ViewSet):
    def list(self, request):
        # Try fetching cached stops first
        cached_stops = cache.get("stops")

        if cached_stops:
            return Response(cached_stops, status=200)

        # Fetch stops from the database instead of PassioGo API
        queryset = Stop.objects.all()
        serializer = StopSerializer(queryset, many=True)

        # Cache the results to avoid unnecessary DB queries
        cache.set("stops", serializer.data, timeout=3600)  # Cache for 1 hour

        return Response(serializer.data, status=200)
    # Fetch live vehicle data from PassioGo API
        

class VehicleViewSet(viewsets.ViewSet):
    def list(self, request):
        """
        This is the code for getting real-time location of the vehicles from the API.
        Fetch and return all active vehicle details from the PassioGo API.
        Caches data for 30 seconds to reduce API calls.
        """
        # Check if vehicle data is cached in Redis
        cached_data = cache.get("bus_locations")

        if cached_data:
            return Response(cached_data)

        # Fetch live vehicle data from PassioGo API
        system = passiogo.getSystemFromID(4834)  
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
        cache.set("bus_locations", data, timeout=30)
        return Response(data)

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    
# WebSocket Test View
"""Currently its rendering request from the test html file, it has to be later changed to the 
actual frontend files."""
# def websocket_test_view(request):
#     return render(request, 'websocket_test.html')
