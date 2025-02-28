from djangorestframework import serializers
from .models import Route, Stop, Vehicle, Alert

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

# Similarly, create serializers for Stop, Vehicle, and Alert
