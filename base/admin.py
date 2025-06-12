from django.contrib import admin
from .models import *

# @admin.register(Review)
# class ReviewAdmin(admin.ModelAdmin):
#     list_display = ['id', 'user', 'gig', 'rating', 'created_at']

admin.site.register(Order)
admin.site.register(User_profile)
admin.site.register(Review)
admin.site.register(Gig)
