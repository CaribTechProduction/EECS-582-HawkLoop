from django.db import models
import passiogo

class Route(models.Model):
    route_id = models.CharField(max_length=100, unique=True)  # Should match PassioGo's route_id
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"Route {self.route_id}: {self.name}"
    

class Stop(models.Model):
    stop_id = models.CharField(max_length=100, unique=True)  # Should match PassioGo's stop_id
    name = models.CharField(max_length=255)
    latitude = models.FloatField()  # Ensure location data is stored
    longitude = models.FloatField()

    def __str__(self):
        return f"Stop {self.stop_id}: {self.name}, Stop Location {self.latitude}, {self.longitude}"

class Vehicle(models.Model):
    vehicle_id = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    # FUTURE: Additional fields as needed

class Alert(models.Model):
    alert_id = models.CharField(max_length=100, unique=True)
    message = models.TextField()
    # FUTURE: Additional fields as needed
    
class VehicleLocation(models.Model):
    vehicle_id = models.CharField(max_length=100)  # No 'unique=True' so we store multiple entries
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)  # Capture when the data was stored
