"""
ASGI config for hawkloop_backend project.

Handles both HTTP and WebSocket protocols using Django Channels.
"""

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from hawkloop_app.routing import websocket_urlpatterns
from django.core.asgi import get_asgi_application
"""This is the most important file that will deal with the websocketing functionalities."""

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hawkloop_backend.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})

