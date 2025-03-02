from django.db import models

class Route(models.Model):
    route_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    # Additional fields as needed

    def __str__(self):
        return self.name

class Stop(models.Model):
    stop_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)  # Ensure stops belong to a route
    latitude = models.FloatField(null=True, blank=True)  # Allow nullable latitude
    longitude = models.FloatField(null=True, blank=True)  # Allow nullable longitude

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    vehicle_id = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    route = models.ForeignKey(Route, on_delete=models.SET_NULL, null=True, blank=True)
    speed = models.FloatField(null=True, blank=True)
    out_of_service = models.BooleanField(default=False)

    def __str__(self):
        return f"Vehicle {self.vehicle_id}"

class Alert(models.Model):
    alert_id = models.CharField(max_length=100, unique=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alert {self.alert_id}"
