from rest_framework import serializers
from .models import Route, Stop, Vehicle, Alert

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

# Similarly, create serializers for Stop, Vehicle, and Alert
class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'
        
class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
        
class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '_all_'