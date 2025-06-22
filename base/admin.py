from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'reviewer', 'reviewee', 'gig', 'rating', 'created_at']

admin.site.register(Order)
# admin.site.register(User_profile)
admin.site.register(Gig)
admin.site.register(GigList)

#POST BIDDING SYSTEM
admin.site.register(ProjectPost)
admin.site.register(Bid)
admin.site.register(CustomUser, UserAdmin)