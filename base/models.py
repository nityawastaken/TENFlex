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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gigs')
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100)  # Filter
    location = models.CharField(max_length=100)  # Filter
    language = models.CharField(max_length=100)  # Filter
    delivery_time = models.PositiveIntegerField(help_text="Delivery time in days")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    avg_rating = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.title} by {self.user.username}"

# Order model
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name='orders')
    buyer = models.ForeignKey(User_profile, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"

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

#POST-BIDDING SYSTEM

class ProjectPost(models.Model):
    client = models.ForeignKey(User_profile, on_delete=models.CASCADE, related_name='project_posts')
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField(null=True, blank=True)  # Optional field
    deadline = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    skills_required = models.TextField(blank=True)   # Example: "HTML,CSS,React"
    categories = models.TextField(blank=True)        # Example: "Frontend,Full Stack"
    is_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_bid = models.OneToOneField('Bid', on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_for_project')

    def __str__(self):
        return f"{self.title} by {self.client.name}"


class Bid(models.Model):
    project = models.ForeignKey(ProjectPost, on_delete=models.CASCADE, related_name='bids')
    freelancer = models.ForeignKey(User_profile, on_delete=models.CASCADE, related_name='bids')
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bid by {self.freelancer.name} on {self.project.title}"
