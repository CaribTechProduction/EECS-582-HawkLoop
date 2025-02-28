from django.db import models

class Route(models.Model):
    route_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    # Additional fields as needed

class Stop(models.Model):
    stop_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    # Additional fields as needed

class Vehicle(models.Model):
    vehicle_id = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    # Additional fields as needed

class Alert(models.Model):
    alert_id = models.CharField(max_length=100, unique=True)
    message = models.TextField()
    # Additional fields as needed
