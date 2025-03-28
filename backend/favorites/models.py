from django.db import models
from django.conf import settings

class FavoriteRoute(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorite_routes'
    )
    # Use the app label 'hawkloop_app' here.
    route = models.ForeignKey(
        'hawkloop_app.Route',
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'route')  # Prevent duplicate favorites
        ordering = ['-created_at']  # Latest favorite first

    def __str__(self):
        return f"{self.user.username} favorited {self.route.name}"
