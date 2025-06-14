from rest_framework.permissions import BasePermission

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
