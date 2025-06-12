from rest_framework import serializers
from .models import Review, Gig, User_profile, Order

class ReviewSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    gig_id = serializers.IntegerField(write_only=True)  # input only

    class Meta:
        model = Review
        fields = ['id', 'user_id', 'gig_id', 'rating', 'comment', 'created_at']
        read_only_fields = ['user_id', 'created_at']

    def create(self, validated_data):
        gig_id = validated_data.pop('gig_id')
        gig = Gig.objects.get(id=gig_id)  # Get the actual Gig instance
        return Review.objects.create(gig=gig, **validated_data)

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
