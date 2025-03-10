# The code snippet you provided is a URL configuration for a Django project named `hawkloop_backend`.
# In Django, the `urlpatterns` list is used to route URLs to views within the project.
"""
URL configuration for hawkloop_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hawkloop_app.views import RouteViewSet, StopViewSet, VehicleViewSet, AlertViewSet

# Initialize the router for API endpoints
router = DefaultRouter()
router.register(r'routes', RouteViewSet, basename='routes')
router.register(r'stops', StopViewSet, basename='stops')
router.register(r'vehicles', VehicleViewSet, basename='vehicles')
router.register(r'alerts', AlertViewSet, basename='alerts')

urlpatterns = [
    path('admin/', admin.site.urls),  # Default Django admin panel
    path('api/', include(router.urls)),  # API endpoints for routes, stops, vehicles, and alerts
    path('api/', include('hawkloop_app.urls')),
    # path("api/live-buses/", LiveBusLocationView.as_view(), name="live-buses"),  # API for live bus tracking
]

