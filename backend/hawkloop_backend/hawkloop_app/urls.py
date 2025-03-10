from django.urls import path
from .views import VehicleViewSet, RouteViewSet, StopViewSet, AlertViewSet

urlpatterns = [
    path('routes/', RouteViewSet.as_view({'get': 'list'}), name='routes-list'),
    path('stops/', StopViewSet.as_view({'get': 'list'}), name='stops-list'),
    path('vehicles/', VehicleViewSet.as_view({'get': 'list'}), name='vehicles-list'),
    path('alerts/', AlertViewSet.as_view({'get': 'list'}), name='alerts-list'),
]

