from rest_framework import serializers
from .models import Review, Gig

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
