from django.contrib import admin
from .models import Review, Gig

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'gig', 'rating', 'created_at']

admin.site.register(Gig)
