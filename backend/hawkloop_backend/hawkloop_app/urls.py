from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RouteViewSet, StopViewSet, VehicleViewSet, AlertViewSet, LiveBusLocationView

# Initialize router
router = DefaultRouter()
router.register(r'routes', RouteViewSet, basename='routes')
router.register(r'stops', StopViewSet, basename='stops')
router.register(r'vehicles', VehicleViewSet, basename='vehicles')
router.register(r'alerts', AlertViewSet, basename='alerts')

urlpatterns = router.urls + [
    path("live-buses/", LiveBusLocationView.as_view(), name="live-buses"),
]
