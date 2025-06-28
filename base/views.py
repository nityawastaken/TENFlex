from rest_framework.response import Response
from rest_framework import viewsets, status, filters, permissions
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly,AllowAny
from rest_framework.decorators import api_view, permission_classes
from .serializers import *
from .models import *
from .filters import *
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q

# View for sign up
# class SignUpView(FormView):
#     template_name = 'accounts/signup.html' # Name of the HTML file can be changed according to the frontend
#     form_class = SignUpForm
#     success_url = reverse_lazy('login')

#     def form_valid(self, form):
#         user = form.save()
#         login(self.request, user)
#         return super().form_valid(form)
    
# # View for login
# class CustomLoginView(LoginView):
#     template_name = 'accounts/login.html' # Name of the HTML file can be changed according to the frontend
#     authentication_form = AuthenticationForm

#     def get_success_url(self):
#         return reverse_lazy('home')  # Redirect to home or any other page after login
    
#view for Reviews
# class ReviewViewSet(viewsets.ModelViewSet):
#     queryset = Review.objects.all()
#     serializer_class = ReviewSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly]
#     filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
#     filterset_class = ReviewFilter
#     ordering_fields = ['created_at', 'rating']
#     ordering = ['-created_at']
#     search_fields = ['comment', 'rating']

#     def destroy(self, request, *args, **kwargs):
#         reviewer_id = request.query_params.get('reviewer_id')
#         reviewee_id = request.query_params.get('reviewee_id')

#         if reviewer_id:
#             deleted_count, _ = Review.objects.filter(reviewer__id=reviewer_id).delete()
#             return Response(
#                 {"message": f"{deleted_count} reviews deleted for reviewer_id {reviewer_id}"},
#                 status=status.HTTP_204_NO_CONTENT
#             )
#         elif reviewee_id:
#             deleted_count, _ = Review.objects.filter(reviewee__id=reviewee_id).delete()
#             return Response(
#                 {"message": f"{deleted_count} reviews deleted for reviewee_id {reviewee_id}"},
#                 status=status.HTTP_204_NO_CONTENT
#             )

#         return super().destroy(request, *args, **kwargs)
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = ReviewFilter
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']
    search_fields = ['comment', 'rating']
    def destroy(self, request, *args, **kwargs):
        reviewer_id = request.query_params.get('reviewer_id')
        reviewee_id = request.query_params.get('reviewee_id')
        # Delete via query parameters
        if reviewer_id:
            if int(reviewer_id) != request.user.id:
                return Response({"detail": "You do not have permission to delete these reviews."},
                                status=status.HTTP_403_FORBIDDEN)
            deleted_count, _ = Review.objects.filter(reviewer__id=reviewer_id).delete()
            return Response({"message": f"{deleted_count} reviews deleted for reviewer_id {reviewer_id}"},
                            status=status.HTTP_204_NO_CONTENT)
        elif reviewee_id:
            return Response({"detail": "Only reviewers can delete their own reviews, not reviewees."},
                            status=status.HTTP_403_FORBIDDEN)
        # Delete a single review
        instance = self.get_object()
        if instance.reviewer.id != request.user.id:
            return Response({"detail": "You do not have permission to delete this review."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.reviewer.id != request.user.id:
            return Response({"detail": "You do not have permission to update this review."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.reviewer.id != request.user.id:
            return Response({"detail": "You do not have permission to update this review."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args,**kwargs)

# View for gigs
class GigViewSet(viewsets.ModelViewSet):
    queryset = Gig.objects.all().order_by('-created_at')
    serializer_class = GigSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['title']
    filterset_class = GigFilter
    ordering_fields = ['price', 'created_at', 'delivery_time', 'avg_rating']
    def perform_create(self, serializer):
        user_profile = self.request.user
        if not user_profile.is_freelancer:
            raise serializers.ValidationError("Only freelancers can create gigs.")
        serializer.save(freelancer=self.request.user)
    def update(self, request, *args, **kwargs):
        gig = self.get_object()
        if gig.freelancer != request.user:
            return Response({'detail': 'You do not have permission to update this gig.'}, status=403)
        return super().update(request, *args, **kwargs)
    def destroy(self, request, *args, **kwargs):
        gig = self.get_object()
        if gig.freelancer != request.user:
            return Response({'detail': 'You do not have permission to delete this gig.'}, status=403)
        return super().destroy(request, *args, **kwargs)
    def get_queryset(self):
        queryset = Gig.objects.all().order_by('-created_at')
        skills = self.request.query_params.get('skills')
        categories = self.request.query_params.get('categories')
        filters = Q()
        if skills:
            skill_ids = [int(id) for id in skills.split(',')]
            filters |= Q(skills__in=skill_ids)
        if categories:
            category_ids = [int(id) for id in categories.split(',')]
            filters |= Q(categories__in=category_ids)
        if filters:
            queryset = queryset.filter(filters).distinct()
        return queryset

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def gigs_by_freelancer(request, pk):
    freelancer = get_object_or_404(CustomUser, pk=pk)

    if not freelancer.is_freelancer:
        return Response({"error": "This user is not a freelancer."}, status=400)

    gigs = Gig.objects.filter(freelancer=freelancer).order_by('-created_at')
    serializer = GigSerializer(gigs, many=True)
    return Response(serializer.data)

# View for buyer's specific orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buyer_orders(request):
    try:
        orders = Order.objects.filter(buyer=request.user).order_by('-created_at')
        sections = {
            "pending": orders.filter(status="pending"),
            "ongoing": orders.filter(status="ongoing"),
            "completed": orders.filter(status="completed"),
        }
        result = {section: OrderSerializer(orders, many=True).data for section, orders in sections.items()}
        return Response(result, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

#Freelancer's view for orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def freelancer_orders(request):
    try:
        freelancer = request.user
        # 🔍 All orders where this user is the freelancer (gig OR project)
        orders = Order.objects.filter(freelancer=freelancer).order_by('-created_at')
        # 🔄 Group by status
        sections = {
            "pending": orders.filter(status="pending"),
            "ongoing": orders.filter(status="ongoing"),
            "completed": orders.filter(status="completed"),
        }
        result = {section: OrderSerializer(orders, many=True).data for section, orders in sections.items()}
        return Response(result, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# View to get a single order
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        # Ensure only the buyer or related freelancer can access the order
        if request.user not in [order.buyer, order.gig.freelancer]:
            return Response({"error": "Unauthorized access"}, status=403)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

#Repeat order view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def repeat_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    # Check if current user is the original buyer
    if order.buyer != request.user:
        return Response({'error': 'Unauthorized to repeat this order'}, status=403)
    # Repeat only if the order is a gig-type
    if order.type != 'gig':
        return Response({'error': 'Only gig orders can be repeated.'}, status=400)
    # Create a new order with same gig ID and freelancer
    new_order = Order.objects.create(
        type='gig',
        item_id=order.item_id,
        buyer=order.buyer,
        freelancer=order.freelancer,
        status='pending'
    )
    serializer = OrderSerializer(new_order)
    return Response(serializer.data, status=201)


# View to update order status
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        # ✅ Check if current user is the freelancer assigned to this order
        if order.type == 'gig':
            gig = Gig.objects.get(id=order.item_id)
            freelancer = gig.freelancer
        elif order.type == 'project':
            bid = Bid.objects.get(project__id=order.item_id, is_accepted=True)
            freelancer = bid.freelancer
        else:
            return Response({"error": "Unknown order type."}, status=400)
        if request.user != freelancer:
            return Response({"error": "Only the assigned freelancer can update the order status."}, status=403)
        # ✅ Validate status
        new_status = request.data.get("status")
        if new_status not in ["pending", "ongoing", "complete"]:
            return Response({"error": "Invalid status"}, status=400)
        order.status = new_status
        order.save()
        return Response({"message": "Order status updated successfully"}, status=200)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)
    except (Gig.DoesNotExist, Bid.DoesNotExist):
        return Response({"error": "Associated object not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

#View to add an order
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order(request, gig_id):
    try:
        gig = get_object_or_404(Gig, id=gig_id)
        buyer = request.user
        # ❗ Prevent freelancers from ordering
        if buyer.is_freelancer:
            return Response({"error": "Freelancers cannot place orders."}, status=403)
        # Optional status field (defaults to 'pending')
        status = request.data.get("status", "pending")
        if status not in ["pending", "ongoing", "complete"]:
            return Response({"error": "Invalid status."}, status=400)
        # ✅ Create order with type='gig' and item_id only
        order = Order.objects.create(
            type='gig',
            item_id=gig.id,
            buyer=buyer,
            freelancer=gig.freelancer,
            status=status
        )
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User_profile.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly]

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_profile_view(request):
#     user = request.user

#     if hasattr(user, 'user_profile'):
#         return Response({'detail': 'Profile already exists.'}, status=400)

#     data = request.data.copy()
#     data['user'] = user.id
#     serializer = CustomUserSerializer(data=data)
#     if serializer.is_valid():
#         serializer.save(user=user)
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)

# @api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
# @permission_classes([IsAuthenticated])
# def profile_detail_view(request, pk):
#     from django.shortcuts import get_object_or_404
#     profile = get_object_or_404(CustomUser, pk=pk)

#     permission = CanViewOrEditProfile()
#     if request.method == 'GET':
#         if not permission.has_object_permission(request, None, profile):
#             return Response({'detail': 'You do not have permission to view this profile.'}, status=403)
#         serializer = CustomUserSerializer(profile)
#         return Response(serializer.data)

#     if profile.user != request.user:
#         return Response({'detail': 'You do not have permission to modify this profile.'}, status=403)

#     if request.method in ['PUT', 'PATCH']:
#         serializer = CustomUserSerializer(profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)

#     elif request.method == 'DELETE':
#         profile.delete()
#         return Response({'detail': 'Profile deleted successfully.'}, status=204)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    data = request.data
    required_fields = ['username', 'email', 'password', 'is_freelancer']

    if not all(field in data for field in required_fields):
        return Response({'error': 'username, email, password, and is_freelancer are required.'}, status=400)

    if CustomUser.objects.filter(username=data['username']).exists():
        return Response({'error': 'Username already taken.'}, status=400)

    user = CustomUser.objects.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        is_freelancer=data.get('is_freelancer', False),
        bio=data.get('bio', ''),
        location=data.get('location', ''),
    )
    serializer = CustomUserSerializer(user)
    return Response(serializer.data, status=201)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile_detail_view(request, pk):
    profile = get_object_or_404(CustomUser, pk=pk)
    if request.method == 'GET':
        # Everyone can see freelancers. Freelancers can't see clients.
        # if not profile.is_freelancer:
        #     if request.user.is_freelancer:
        #         return Response({'detail': 'You do not have permission to view this profile.'}, status=403)
        serializer = CustomUserSerializer(profile)
        return Response(serializer.data)
    # Only the owner of the profile can edit or delete it
    if profile != request.user:
        return Response({'detail': 'You do not have permission to modify this profile.'}, status=403)
    if request.method in ['PUT', 'PATCH']:
        serializer = CustomUserSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        profile.delete()
        return Response({'detail': 'Your account has been deleted successfully.'}, status=204)

# @api_view(['PATCH'])
# @permission_classes([IsAuthenticated])
# def complete_profile(request):
#     user = request.user
#     serializer = CustomUserSerializer(user, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({'message': 'Profile updated'})
#     return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_completion(request):
    user = request.user
    common = ['bio', 'location', 'profile_picture']
    freelancer_fields = ['skills', 'category_tags', 'experience']
    client_fields = ['role', 'use_purpose']
    fields = common + (freelancer_fields if user.is_freelancer else client_fields)
    filled = sum(bool(getattr(user, f)) for f in fields)
    return Response(int(filled / len(fields) * 100))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_giglists(request):
    giglists = GigList.objects.filter(user=request.user).order_by('-created_at')
    serializer = GigListSerializer(giglists, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_giglist(request):
    name = request.data.get('name')
    if request.user.is_freelancer:
        return Response({'error': 'Freelancers cannot create gig lists.'}, status=403)
    if not name:
        return Response({'error': 'Name is required'}, status=400)
    giglist = GigList.objects.create(user=request.user, name=name)
    return Response(GigListSerializer(giglist).data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_gig_to_list(request, list_id):
    try:
        giglist = GigList.objects.get(id=list_id, user=request.user)
    except GigList.DoesNotExist:
        return Response({'error': 'Gig list not found'}, status=404)
    gig_id = request.data.get('gig_id')
    try:
        gig = Gig.objects.get(id=gig_id)
    except Gig.DoesNotExist:
        return Response({'error': 'Gig not found'}, status=404)
    if gig in giglist.gigs.all():
        return Response({'error': 'Gig is already in this list'}, status=400)
    giglist.gigs.add(gig)
    return Response({'message': 'Gig added to list'}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_gig_from_list(request, list_id):
    try:
        giglist = GigList.objects.get(id=list_id, user=request.user)
    except GigList.DoesNotExist:
        return Response({'error': 'Gig list not found'}, status=404)
    gig_id = request.data.get('gig_id')
    try:
        gig = Gig.objects.get(id=gig_id)
    except Gig.DoesNotExist:
        return Response({'error': 'Gig not found'}, status=404)
    giglist.gigs.remove(gig)
    return Response({'message': 'Gig removed from list'}, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_giglist(request, list_id):
    try:
        giglist = GigList.objects.get(id=list_id, user=request.user)
    except GigList.DoesNotExist:
        return Response({'error': 'Gig list not found'}, status=404)
    giglist.delete()
    return Response({'message': 'Gig list deleted'}, status=204)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_giglist(request, list_id):
    try:
        giglist = GigList.objects.get(id=list_id, user=request.user)
    except GigList.DoesNotExist:
        return Response({'error': 'Gig list not found'}, status=404)
    serializer = GigListSerializer(giglist)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def rename_giglist(request, list_id):
    try:
        giglist = GigList.objects.get(id=list_id, user=request.user)
    except GigList.DoesNotExist:
        return Response({'error': 'Gig list not found'}, status=404)
    new_name = request.data.get('name')
    if not new_name:
        return Response({'error': 'Name is required'}, status=400)
    giglist.name = new_name
    giglist.save()
    return Response({'message': 'Gig list renamed successfully', 'name': giglist.name})

#POST BIDDING SYSTEM

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project_post(request):
    user = request.user
    if user.is_freelancer:
        return Response({'error': 'Only clients can create project posts.'}, status=403)
    data = request.data.copy()
    data['client'] = user.id  # assign logged-in user as client
    serializer = ProjectPostSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_project_posts(request):
    user = request.user
    if user.is_freelancer:
        projects = ProjectPost.objects.filter(is_open=True)
    else:
        projects = ProjectPost.objects.filter(client=user)
    min_bid = request.GET.get('min_bid')
    max_bid = request.GET.get('max_bid')
    sort_by = request.GET.get('sort_by', 'date_desc')
    # 🔄 Convert skill/category filters
    skill_ids = request.GET.get('skills')
    category_ids = request.GET.get('categories')
    q_filter = Q()
    if skill_ids:
        skill_ids = [int(id) for id in skill_ids.split(',')]
        q_filter |= Q(skills_required__in=skill_ids)
    if category_ids:
        category_ids = [int(id) for id in category_ids.split(',')]
        q_filter |= Q(categories__in=category_ids)
    if q_filter:
        projects = projects.filter(q_filter).distinct()
    # 🔁 Filter & sort bids inside each project
    result = []
    for project in projects:
        bids = project.bids.all()
        if min_bid:
            bids = bids.filter(bid_amount__gte=min_bid)
        if max_bid:
            bids = bids.filter(bid_amount__lte=max_bid)
        if sort_by == 'amount_asc':
            bids = bids.order_by('bid_amount')
        elif sort_by == 'amount_desc':
            bids = bids.order_by('-bid_amount')
        elif sort_by == 'date_asc':
            bids = bids.order_by('created_at')
        else:
            bids = bids.order_by('-created_at')
        project.bids_filtered = bids
        result.append(project)
    serializer = ProjectPostWithBidsSerializer(result, many=True, context={'bids_override': True})
    return Response(serializer.data, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_bid(request, project_id):
    user = request.user
    if not user.is_freelancer:
        return Response({'error': 'Only freelancers can place bids.'}, status=403)
    try:
        project = ProjectPost.objects.get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if not project.is_open or project.accepted_bid:
        return Response({'error': 'Bidding is closed for this project.'}, status=400)
    data = request.data.copy()
    data['project'] = project.id
    data['freelancer'] = user.id
    serializer = BidSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_bid(request, bid_id):
    user = request.user
    try:
        bid = Bid.objects.select_related('project').get(id=bid_id)
        project = bid.project
    except Bid.DoesNotExist:
        return Response({'error': 'Bid not found.'}, status=404)
    if project.client != user:
        return Response({'error': 'You are not authorized to accept this bid.'}, status=403)
    if project.accepted_bid is not None:
        return Response({'error': 'A bid has already been accepted for this project.'}, status=400)
    bid.is_accepted = True
    bid.save()
    project.accepted_bid = bid
    project.is_open = False
    project.save()
    Order.objects.create(
        buyer=project.client,
        freelancer=bid.freelancer,
        item_id=project.id,
        type='project'
    )
    return Response({'message': 'Bid accepted and order created successfully.'}, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_project_post(request, project_id):
    user = request.user
    try:
        project = ProjectPost.objects.get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if project.client != user:
        return Response({'error': 'You are not authorized to update this project.'}, status=403)
    if not project.is_open:
        return Response({'error': 'Cannot update a project that is already closed.'}, status=400)
    serializer = ProjectPostSerializer(project, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project_post(request, project_id):
    user = request.user
    try:
        project = ProjectPost.objects.get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if project.client != user:
        return Response({'error': 'You are not authorized to delete this project.'}, status=403)
    if not project.is_open:
        return Response({'error': 'Cannot delete a project that has already been closed.'}, status=400)
    project.delete()
    return Response({'message': 'Project deleted successfully.'}, status=204)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reopen_project_post(request, project_id):
    user = request.user
    try:
        project = ProjectPost.objects.select_related('accepted_bid').get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if project.client != user:
        return Response({'error': 'You are not authorized to reopen this project.'}, status=403)
    if project.accepted_bid is None:
        return Response({'error': 'No accepted bid to reject.'}, status=400)
    accepted_bid = project.accepted_bid
    accepted_bid.is_accepted = False
    accepted_bid.save()
    Order.objects.filter(type='project', item_id=project.id).delete()
    project.accepted_bid = None
    project.is_open = True
    project.save()
    return Response({'message': 'Project reopened, bid rejected, and order removed.'}, status=200)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('name')
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'