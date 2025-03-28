from rest_framework import serializers
from .models import FavoriteRoute

class FavoriteRouteSerializer(serializers.ModelSerializer):
    # For convenience, show the route's name from the related Route model.
    route_name = serializers.ReadOnlyField(source='route.name')
    
    class Meta:
        model = FavoriteRoute
        fields = ['id', 'user', 'route', 'route_name', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'route_name']
