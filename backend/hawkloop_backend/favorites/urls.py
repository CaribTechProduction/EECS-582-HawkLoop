from django.urls import path
from .views import FavoriteRouteListCreateAPIView, FavoriteRouteDestroyAPIView

urlpatterns = [
    path('favorites/', FavoriteRouteListCreateAPIView.as_view(), name='favorite-list-create'),
    path('favorites/<int:id>/', FavoriteRouteDestroyAPIView.as_view(), name='favorite-destroy'),
]
