from django.db import models
from django.contrib.auth.models import AbstractUser
from multiselectfield import MultiSelectField
import pycountry
# User profile model
# class User_profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=128)
#     is_freelancer = models.BooleanField(default=False)
#     profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
#     bio = models.TextField(max_length=500, blank=True)
#     location = models.CharField(max_length=100, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    Roles = [
        ('student', 'Student'),
        ('organization', 'Organization'),
    ]
    Purposes =[
        ('personal', 'Personal'),
        ('business', 'Business'),
        ('academic', 'Academic'),
        ('other', 'Other'),
    ]
    LANGUAGE_CHOICES = sorted([
    (lang.alpha_2, lang.name) for lang in pycountry.languages
    if hasattr(lang, 'alpha_2')
    ])
    #common
    is_freelancer = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    lang_spoken = MultiSelectField(choices=LANGUAGE_CHOICES, max_length=100, blank=True)
    #client only
    role = models.CharField(max_length=20, choices=Roles, default='')
    use_purpose = models.CharField(max_length=100,choices= Purposes,default='')
    #freelancer only
    experience = models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('expert', 'Expert')], default='beginner')
    skills = models.ManyToManyField(Skill, blank=True, related_name='freelancers')
    category_tags = models.ManyToManyField(Category, blank=True, related_name='freelancers')
    def __str__(self):
        return self.username

# Gig model
class Gig(models.Model):
    freelancer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='gigs')
    title = models.CharField(max_length=100)
    description = models.TextField()
    categories = models.ManyToManyField(Category, blank=True, related_name='gigs')
    skills = models.ManyToManyField(Skill, blank=True, related_name='gigs')
    # subcategory = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # duration = models.CharField(max_length=100)  # Filter
    # location = models.CharField(max_length=100)  # Filter
    # language = models.CharField(max_length=100)  # Filter
    delivery_time = models.PositiveIntegerField(help_text="Delivery time in days")
    created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)
    picture = models.ImageField(upload_to='gig_pictures/', blank=True, null=True)
    avg_rating = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.title} by {self.freelancer.username}"

# Order model
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    type = models.CharField(max_length=20, choices=[('gig', 'Gig'), ('project', 'Project')], default='gig')
    # gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name='orders')
    item_id = models.PositiveIntegerField()  # Can be Gig ID or Project ID
    buyer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    freelancer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='freelancer_orders', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Order #{self.id} - {self.status}"

# Review model
class Review(models.Model):
    reviewee = models.ForeignKey(CustomUser, related_name='received_reviews', on_delete=models.CASCADE)
    reviewer = models.ForeignKey(CustomUser, related_name='given_reviews', on_delete=models.CASCADE)
    gig = models.ForeignKey(Gig, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    comment = models.TextField()
    picture = models.ImageField(upload_to='review_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.name} for {self.reviewee.name}"


class GigList(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='giglists')
    name = models.CharField(max_length=100)
    gigs = models.ManyToManyField(Gig, blank=True, related_name='giglists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user})"

#POST-BIDDING SYSTEM

class ProjectPost(models.Model):
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='project_posts')
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField(null=True, blank=True)  # Optional field
    deadline = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    skills_required = models.ManyToManyField(Skill, blank=True, related_name='project_posts')
    categories = models.ManyToManyField(Category, blank=True, related_name='project_posts')
    is_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_bid = models.OneToOneField('Bid', on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_for_project')

    def __str__(self):
        return f"{self.title} by {self.client.username}"


class Bid(models.Model):
    project = models.ForeignKey(ProjectPost, on_delete=models.CASCADE, related_name='bids')
    freelancer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bids')
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bid by {self.freelancer.username} on {self.project.title}"
