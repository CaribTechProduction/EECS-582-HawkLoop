# hawkloop_app/routing.py
"""This is the file for routing the consumers file to the new link
where we will be showing the real-time vehicle data."""
from django.urls import re_path
from .consumer import VehicleConsumer

websocket_urlpatterns = [
    re_path(r'ws/vehicles/$', VehicleConsumer.as_asgi()),
]
