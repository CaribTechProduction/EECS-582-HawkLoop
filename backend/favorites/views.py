from django.shortcuts import render
from rest_framework import generics, permissions
from .models import FavoriteRoute
from .serializers import FavoriteRouteSerializer

# API view to list and create favorite routes.
class FavoriteRouteListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FavoriteRouteSerializer
    #permission_classes = [permissions.IsAuthenticated]
    # Temporarily allow any user to access the view for testing:
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        # Return only the favorites for the currently authenticated user.
        #return FavoriteRoute.objects.filter(user=self.request.user)
        return FavoriteRoute.objects.all()  # For testing, you might see all favorites.
    def perform_create(self, serializer):
        # Automatically associate the current user with the new favorite.
        #serializer.save(user=self.request.user)
        # You won't have a logged-in user here; for testing, you could assign a test user
        serializer.save(user=serializer.context.get('request').user or None)
# API view to delete a favorite route.
class FavoriteRouteDestroyAPIView(generics.DestroyAPIView):
    serializer_class = FavoriteRouteSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        # Allow deletion only of favorites belonging to the current user.
        return FavoriteRoute.objects.filter(user=self.request.user)
