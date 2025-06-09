from django.db import models

# Create your models here.
class User_profile(models.Model):
    pass

# Review model
class Review(models.Model):
    gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review by {self.user.username} for {self.gig.title}'

class Gig(models.Model):
    pass