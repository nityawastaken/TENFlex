from django.db import models
from django.contrib.auth.models import User

# User profile model
class User_profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_freelancer = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Gig model
class Gig(models.Model):
    freelancer = models.ForeignKey(User_profile, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer.name} - {self.title}"

# Order model
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    Gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name='orders')
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
    
    # Create a new order based on the current order.
    def repeat_order(self):
        return Order.objects.create(
            Gig=self.Gig,
            buyer=self.buyer,
            status='pending',  # New orders start as pending
        )
    
    # Fetch orders categorized for the given user.
    def get_orders_for_you(user):
        return {
            'Completed': Order.objects.filter(buyer=user, status='completed'),
            'Ongoing': Order.objects.filter(buyer=user, status='in_progress'),
            'Pending': Order.objects.filter(buyer=user, status='pending'),
        }

# Review model
class Review(models.Model):
    reviewer = models.ForeignKey(User_profile, related_name='given_reviews', on_delete=models.CASCADE)
    reviewee = models.ForeignKey(User_profile, related_name='received_reviews', on_delete=models.CASCADE)
    gig = models.ForeignKey(Gig, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.name} for {self.reviewee.name}"


class GigList(models.Model):
    user = models.ForeignKey(User_profile, on_delete=models.CASCADE, related_name='giglists')
    name = models.CharField(max_length=100)
    gigs = models.ManyToManyField(Gig, blank=True, related_name='giglists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user})"
