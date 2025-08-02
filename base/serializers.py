from rest_framework import serializers
from django.db.models import Avg
from .models import *

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

#Review Serializer
class ReviewSerializer(serializers.ModelSerializer):
    reviewer_id = serializers.ReadOnlyField(source='reviewer.id') 
    gig_id = serializers.IntegerField()
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)  
    gig_title = serializers.CharField(source='gig.title', read_only=True)  

    class Meta:
        model = Review
        fields = ['id', 'reviewer_id', 'reviewer_name', 'gig_id', 'gig_title', 'rating', 'comment','picture', 'created_at']
        read_only_fields = ['id', 'created_at', 'reviewer_name', 'gig_title','reviewer_id']

    def create(self, validated_data):
        # reviewer_id = validated_data.pop('reviewer_id')
        request = self.context['request']
        reviewer_id = request.user.id
        gig_id = validated_data.pop('gig_id')
     
        try:
            reviewer = CustomUser.objects.get(id=reviewer_id)  
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({'reviewer_id': 'User not found'})

        try:
            gig = Gig.objects.get(id=gig_id)
        except Gig.DoesNotExist:
            raise serializers.ValidationError({'gig_id': 'Gig not found'})

        reviewee = gig.freelancer  
    # Prevent reviewing own gig
        if reviewer == reviewee:
            raise serializers.ValidationError("You cannot review your own gig.")
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
# class SignUpSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, style={'input_type': 'password'})

#     class Meta:
#         model = User_profile
#         fields = ['email', 'is_freelancer', 'profile_picture', 'bio', 'location', 'password']

#     def create(self, validated_data):
#         user = User_profile.objects.create(
#             email=validated_data['email'],
#             is_freelancer=validated_data.get('is_freelancer', False),
#             profile_picture=validated_data.get('profile_picture'),
#             bio=validated_data.get('bio', ''),
#             location=validated_data.get('location', ''),
#         )
#         user.set_password(validated_data['password'])  # Hash the password
#         user.save()
#         return user

# Order Serializer
# class OrderSerializer(serializers.ModelSerializer):
#     buyer_id = serializers.IntegerField(source='buyer.id', read_only=True)
#     service_id = serializers.IntegerField(write_only=True)  # input only

#     class Meta:
#         model = Order
#         fields = ['id', 'service_id', 'buyer_id', 'status',  'created_at']
#         read_only_fields = ['buyer_id', 'created_at']

#     def create(self, validated_data):
#         service_id = validated_data.pop('service_id')
#         service = Gig.objects.get(id=service_id)  # Get the actual Service instance
#         return Order.objects.create(service=service, **validated_data)
class OrderSerializer(serializers.ModelSerializer):
    type = serializers.CharField()  # project or gig
    buyer_id = serializers.IntegerField(source='buyer.id', read_only=True)
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    freelancer_id = serializers.IntegerField(source='freelancer.id', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.username', read_only=True)
    gig_title = serializers.SerializerMethodField()
    project_title = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ['id', 'type', 'item_id', 'buyer_id', 'buyer_name', 'freelancer_id', 'freelancer_name',
            'gig_title', 'project_title', 'status', 'created_at']
    def get_gig_title(self, obj):
        if obj.type == 'gig':
            gig = Gig.objects.filter(id=obj.item_id).first()
            return gig.title if gig else None
        return None
    def get_project_title(self, obj):
        if obj.type == 'project':
            project = ProjectPost.objects.filter(id=obj.item_id).first()
            return project.title if project else None
        return None
    

# class UserSerializer(serializers.ModelSerializer):
#     avg_rating = serializers.SerializerMethodField()

#     class Meta:
#         model = CustomUser
#         fields = ['id', 'email', 'name', 'profile_picture', 'bio', 'location', 'avg_rating']
#         read_only_fields = ['id']

#     def get_avg_rating(self, obj):
#         # Only for freelancers
#         if not obj.is_freelancer:
#             return None

#         # Get all reviews for gigs where this user is the freelancer
#         gigs = Gig.objects.filter(freelancer=obj)
#         avg = Review.objects.filter(gig__in=gigs).aggregate(Avg('rating'))['rating__avg']

#         if avg is not None:
#             return round(avg, 2)
#         return 0.0

class CustomUserSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    inline_orders = serializers.SerializerMethodField()
    completed_orders = serializers.SerializerMethodField()
    skills = SkillSerializer(many=True, read_only=True)
    skill_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    # skill_ids = serializers.PrimaryKeyRelatedField(
    #     queryset=Skill.objects.all(), many=True, write_only=True, required=False
    # )
    category_tags = CategorySerializer(many=True, read_only=True)
    category_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)    
    lang_spoken = serializers.ListField(child=serializers.ChoiceField(choices=CustomUser.LANGUAGE_CHOICES),required=False)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','contact_number', 'first_name', 'last_name', 'is_freelancer', 'bio', 'location',
                    'profile_picture','lang_spoken','role','use_purpose', 'experience', 'skills',
                    'category_tags', 'skill_names', 'category_names', 'avg_rating','inline_orders', 'completed_orders','created_at']
        read_only_fields = ['id', 'username', 'email', 'avg_rating','inline_orders', 'completed_orders']
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_freelancer:
            # Remove client-only fields
            data.pop('role', None)
            data.pop('use_purpose', None)
        else:
            # Remove freelancer-only fields
            data.pop('skills', None)
            data.pop('category_tags', None)
            data.pop('experience', None)

        return data

    def get_avg_rating(self, user):
        if not user.is_freelancer:
            return None
        gigs = Gig.objects.filter(freelancer=user)
        avg = Review.objects.filter(gig__in=gigs).aggregate(Avg('rating'))['rating__avg']
        return round(avg, 2) if avg else 0.0
    
    # def update(self, instance, validated_data):
    #     if 'skill_ids' in validated_data:
    #         instance.skills.set(validated_data.pop('skill_ids'))
    #     if 'category_ids' in validated_data:
    #         instance.category_tags.set(validated_data.pop('category_ids'))
    #     return super().update(instance, validated_data)

    def update(self, instance, validated_data):
        # Handle skill names
        skill_names = validated_data.pop('skill_names', [])
        if skill_names:
            skill_objs = []
            for name in skill_names:
                name = name.strip().title()
                skill, _ = Skill.objects.get_or_create(name=name)
                skill_objs.append(skill)
            instance.skills.set(skill_objs)

        # Handle categories
        category_names = validated_data.pop('category_names', [])
        if category_names:
            category_objs = []
            for name in category_names:
                name = name.strip().title()
                category, _ = Category.objects.get_or_create(name=name)
                category_objs.append(category)
            instance.category_tags.set(category_objs)

        return super().update(instance, validated_data)

    def create(self, validated_data):
        skill_names = validated_data.pop('skill_names', [])
        category_names = validated_data.pop('category_ids', [])

        user = CustomUser.objects.create(**validated_data)

        if skill_names:
            skill_objs = []
            for name in skill_names:
                name = name.strip().title()
                skill, _ = Skill.objects.get_or_create(name=name)
                skill_objs.append(skill)
            user.skills.set(skill_objs)

        category_names = validated_data.pop('category_names', [])
        category_objs = []
        for name in category_names:
            name = name.strip().title()
            category, _ = Category.objects.get_or_create(name=name)
            category_objs.append(category)
        user.category_tags.set(category_objs)

        return user
    
    def get_inline_orders(self, obj):
        if not obj.is_freelancer:
            return 0
        return Order.objects.filter(
            freelancer=obj,
            type='gig',
            status__in=['pending', 'ongoing']
        ).count()

    def get_completed_orders(self, obj):
        if not obj.is_freelancer:
            return 0
        return Order.objects.filter(
            freelancer=obj,
            type='gig',
            status='completed'
        ).count()

    
class GigSerializer(serializers.ModelSerializer):
    freelancer = serializers.ReadOnlyField(source='freelancer.username')
    freelancer_id = serializers.ReadOnlyField(source='freelancer.id')
    # avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    order_inline_count = serializers.SerializerMethodField()
    order_completed_count = serializers.SerializerMethodField()
    # Read-only for GET
    categories = CategorySerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    # Write-only for POST/PUT
    category_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    skill_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    class Meta:
        model = Gig
        fields = [
            'id', 'freelancer_id','freelancer', 'title', 'description',
            'price', 'delivery_time', 'created_at', 'picture',
            'avg_rating', 'review_count',
            'categories', 'category_names',
            'skills', 'skill_names','order_inline_count','order_completed_count'
        ]
        read_only_fields = [
            'id', 'created_at', 'freelancer',
            'avg_rating', 'review_count','order_inline_count', 'order_completed_count'
        ]
    # def get_avg_rating(self, obj):
    #     reviews = Review.objects.filter(gig=obj)
    #     if reviews.exists():
    #         avg = reviews.aggregate(models.Avg('rating'))['rating__avg']
    #         return round(avg, 2)
    #     return 0.0
    def get_review_count(self, obj):
        return Review.objects.filter(gig=obj).count()
    def get_order_inline_count(self, obj):
        return Order.objects.filter(type='gig', item_id=obj.id, status__in=['pending', 'ongoing']).count()
    def get_order_completed_count(self, obj):
        return Order.objects.filter(type='gig', item_id=obj.id, status='completed').count()
    def create(self, validated_data):
        skill_names = validated_data.pop('skill_names', [])
        category_names = validated_data.pop('category_names', [])

        gig = Gig.objects.create(**validated_data)

        category_objs = []
        for name in category_names:
            name = name.strip().title()
            category, _ = Category.objects.get_or_create(name=name)
            category_objs.append(category)
        gig.categories.set(category_objs)

        # Handle skill name-based assignment
        skill_objs = []
        for name in skill_names:
            skill_obj, _ = Skill.objects.get_or_create(name__iexact=name.strip(), defaults={'name': name.strip()})
            skill_objs.append(skill_obj)
        gig.skills.set(skill_objs)

        return gig

    def update(self, instance, validated_data):
        category_names = validated_data.pop('category_names', [])
        if category_names:
            category_objs = []
            for name in category_names:
                name = name.strip().title()
                category, _ = Category.objects.get_or_create(name=name)
                category_objs.append(category)
            instance.categories.set(category_objs)

        if 'skill_names' in validated_data:
            skill_objs = []
            for name in validated_data.pop('skill_names'):
                skill_obj, _ = Skill.objects.get_or_create(name__iexact=name.strip(), defaults={'name': name.strip()})
                skill_objs.append(skill_obj)
            instance.skills.set(skill_objs)

        return super().update(instance, validated_data)

    
class GigListSerializer(serializers.ModelSerializer):
    # gigs = serializers.SerializerMethodField()
    gigs = GigSerializer(many=True, read_only=True)

    class Meta:
        model = GigList
        fields = ['id', 'name', 'gigs', 'created_at']

    def get_gigs(self, obj):
        return [
            {
                'id': gig.id,
                'title': gig.title  # or gig.name if that's the field
            }
            for gig in obj.gigs.all()
        ]
        
#POST BIDDING SYSTEM
class ProjectPostSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    accepted_bid_id = serializers.IntegerField(read_only=True)
    # For GET: show list of skill/category objects
    skills = SkillSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    # For POST/PUT: accept just the IDs
    skill_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    category_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    class Meta:
        model = ProjectPost
        fields = [
            'id', 'client', 'client_name',
            'title', 'description', 'start_date', 'deadline', 'budget',
            'skills', 'categories',  # For GET
            'skill_names', 'category_names',      # For POST/PUT
            'is_open', 'accepted_bid_id', 'created_at'
        ]
        read_only_fields = [
            'id', 'client_name', 'accepted_bid_id', 'created_at', 'is_open'
        ]
    def create(self, validated_data):
        skill_names = validated_data.pop('skill_names', [])
        category_names = validated_data.pop('category_ids', [])

        projectpost = ProjectPost.objects.create(**validated_data)

        if skill_names:
            skill_objs = []
            for name in skill_names:
                name = name.strip().title()
                skill, _ = Skill.objects.get_or_create(name=name)
                skill_objs.append(skill)
            projectpost.skills.set(skill_objs)

        category_names = validated_data.pop('category_names', [])
        category_objs = []
        for name in category_names:
            name = name.strip().title()
            category, _ = Category.objects.get_or_create(name=name)
            category_objs.append(category)
        projectpost.categories.set(category_objs)

        return projectpost
    def update(self, instance, validated_data):
        category_names = validated_data.pop('category_names', [])
        if category_names:
            category_objs = []
            for name in category_names:
                name = name.strip().title()
                category, _ = Category.objects.get_or_create(name=name)
                category_objs.append(category)
            instance.categories.set(category_objs)

        if 'skill_names' in validated_data:
            skill_objs = []
            for name in validated_data.pop('skill_names'):
                skill_obj, _ = Skill.objects.get_or_create(name__iexact=name.strip(), defaults={'name': name.strip()})
                skill_objs.append(skill_obj)
            instance.skills.set(skill_objs)

        return super().update(instance, validated_data)

class BidSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source='freelancer.username', read_only=True)
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
    freelancer_name = serializers.CharField(source='freelancer.username', read_only=True)
    class Meta:
        model = Bid
        fields = ['id', 'freelancer_name', 'bid_amount', 'message', 'is_accepted', 'created_at']

class ProjectPostWithBidsSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
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
