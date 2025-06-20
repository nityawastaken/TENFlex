from rest_framework import serializers
from .models import *

#Review Serializer 
class ReviewSerializer(serializers.ModelSerializer):
    reviewer_id = serializers.IntegerField()  
    gig_id = serializers.IntegerField()
    reviewer_name = serializers.CharField(source='reviewer.name', read_only=True)  
    gig_title = serializers.CharField(source='gig.title', read_only=True)  

    class Meta:
        model = Review
        fields = ['id', 'reviewer_id', 'reviewer_name', 'gig_id', 'gig_title', 'rating', 'comment','picture', 'created_at']
        read_only_fields = ['id', 'created_at', 'reviewer_name', 'gig_title']

    def create(self, validated_data):
        reviewer_id = validated_data.pop('reviewer_id')
        gig_id = validated_data.pop('gig_id')

        try:
            reviewer = User_profile.objects.get(id=reviewer_id)  
        except User_profile.DoesNotExist:
            raise serializers.ValidationError({'reviewer_id': 'User not found'})

        try:
            gig = Gig.objects.get(id=gig_id)
        except Gig.DoesNotExist:
            raise serializers.ValidationError({'gig_id': 'Gig not found'})

        reviewee = gig.freelancer  

        return Review.objects.create(
            reviewer=reviewer,
            reviewee=reviewee,
            gig=gig,
            **validated_data
        )

    def update(self, instance, validated_data):
        validated_data.pop('reviewer_id', None)
        validated_data.pop('gig_id', None)
        return super().update(instance, validated_data)


# SignUp Serializer
class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User_profile
        fields = ['email', 'is_freelancer', 'profile_picture', 'bio', 'location', 'password']

    def create(self, validated_data):
        user = User_profile.objects.create(
            email=validated_data['email'],
            is_freelancer=validated_data.get('is_freelancer', False),
            profile_picture=validated_data.get('profile_picture'),
            bio=validated_data.get('bio', ''),
            location=validated_data.get('location', ''),
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user

# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    buyer_id = serializers.IntegerField(source='buyer.id', read_only=True)
    service_id = serializers.IntegerField(write_only=True)  # input only
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'service_id', 'buyer_id', 'status', 'status_display', 'created_at']
        read_only_fields = ['buyer_id', 'created_at', 'status_display']

    def create(self, validated_data):
        service_id = validated_data.pop('service_id')
        service = Gig.objects.get(id=service_id)  # Get the actual Service instance
        return Order.objects.create(service=service, **validated_data)
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_profile
        fields = ['id', 'email', 'name', 'profile_picture', 'bio','location']
        read_only_fields = ['id']

class GigSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    avg_rating = serializers.SerializerMethodField()
    class Meta:
        model = Gig
        fields = '__all__'
        
    def get_avg_rating(self, obj):
        reviews = Review.objects.filter(gig=obj)
        if reviews.exists():
            avg = reviews.aggregate(models.Avg('rating'))['rating__avg']
            return round(avg, 2)
        return 0.0

class GigListSerializer(serializers.ModelSerializer):
    gigs = GigSerializer(many=True, read_only=True)

    class Meta:
        model = GigList
        fields = ['id', 'name', 'gigs', 'created_at']
        
#POST BIDDING SYSTEM

class ProjectPostSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    accepted_bid_id = serializers.IntegerField(read_only=True)
    class Meta:
        model = ProjectPost
        fields = [
            'id', 'client', 'client_name', 'title', 'description',
            'start_date', 'deadline', 'budget',
            'skills_required', 'categories',
            'is_open', 'accepted_bid_id', 'created_at'
        ]
        read_only_fields = ['id', 'is_open', 'accepted_bid_id', 'created_at', 'client_name']

class BidSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source='freelancer.name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Bid
        fields = [
            'id', 'project', 'project_title', 'freelancer',
            'freelancer_name', 'bid_amount', 'message',
            'is_accepted', 'created_at'
        ]
        read_only_fields = [
            'id', 'is_accepted', 'created_at',
            'freelancer_name', 'project_title'
        ]

# A mini serializer for displaying each bid inside a project
class BidMiniSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source='freelancer.name', read_only=True)
    class Meta:
        model = Bid
        fields = ['id', 'freelancer_name', 'bid_amount', 'message', 'is_accepted', 'created_at']

class ProjectPostWithBidsSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    bids = serializers.SerializerMethodField()
    class Meta:
        model = ProjectPost
        fields = [
            'id', 'client', 'client_name', 'title', 'description',
            'start_date', 'deadline', 'budget',
            'skills_required', 'categories', 'is_open', 'accepted_bid',
            'created_at', 'bids'
        ]
    def get_bids(self, obj):
        bids = getattr(obj, 'bids_filtered', obj.bids.all().order_by('-created_at'))
        return BidMiniSerializer(bids, many=True).data
