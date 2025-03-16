from django.db import models
import passiogo_up
# from django.contrib.gis.db import models

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
    calculatedCourse = models.FloatField()
    longitude = models.FloatField()
    # Additional fields as needed

class Alert(models.Model):
    alert_id = models.CharField(max_length=100, unique=True)
    message = models.TextField()
    # Additional fields as needed

# class BusLocation(models.Model):
#     bus_id = models.CharField(max_length=50, unique=True)
#     route_id = models.CharField(max_length=50)
#     latitude = models.FloatField()
#     longitude = models.FloatField()
#     timestamp = models.DateTimeField(auto_now_add=True)
#     # location = models.PointField(geography=True, srid=4326)  # PostGIS Point Field

#     def __str__(self):
#         return f"Bus {self.bus_id} at {self.latitude}, {self.longitude}"
