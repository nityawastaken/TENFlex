from rest_framework.permissions import BasePermission
from rest_framework import permissions

class CanViewOrEditProfile(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user

        # Always allow viewing/editing own profile
        if obj.user == user:
            return True

        # Only allow clients or freelancers to view other freelancers
        if obj.is_freelancer:
            return True  # allow viewing freelancer profile

        # Disallow viewing clients' profiles by others
        return False
    

class IsFreelancerOnly(permissions.BasePermission):
    """
    Custom permission: Only freelancers can create or modify gigs.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # Everyone can read/list

        # Check if the user has a profile and is a freelancer
        return hasattr(request.user, 'profile') and request.user.profile.is_freelancer

