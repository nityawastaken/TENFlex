from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Dummy Gig model for testing
class Gig(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title

# Review model
class Review(models.Model):
    gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review by {self.user.username} for {self.gig.title}'
