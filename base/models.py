from django.db import models
from django.contrib.auth.models import AbstractUser

# User profile model
class User_profile(models.Model):
    email = models.EmailField(unique=True)
    is_freelancer = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

# Review model
class Review(models.Model):
    gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User_profile, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review by {self.user.username} for {self.gig.title}'

# Gig model
class Gig(models.Model):
    pass

# Service model
class Service(models.Model):
    freelancer = models.ForeignKey(User_profile, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer.username} - {self.title}"

# Order model
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='orders')
    buyer = models.ForeignKey(User_profile, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"

    @staticmethod
    def get_orders_by_status(user, user_type, status):
        if user_type == "buyer":
            return Order.objects.filter(buyer=user, status=status)
        elif user_type == "freelancer":
            return Order.objects.filter(service__freelancer=user, status=status)
        return Order.objects.none()

    @staticmethod
    def get_orders_summary(user, user_type):
        return {
            'Completed': Order.get_orders_by_status(user, user_type, 'completed'),
            'Ongoing': Order.get_orders_by_status(user, user_type, 'in_progress'),
            'Pending': Order.get_orders_by_status(user, user_type, 'pending'),
        }
