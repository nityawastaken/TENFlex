from rest_framework.response import Response
from rest_framework import viewsets, status, filters, permissions
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .serializers import *
from .models import *
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from .filters import *
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import CanViewOrEditProfile, IsFreelancerOnly
from django.shortcuts import get_object_or_404

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
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title']
    # filterset_class = GigFilter
    ordering_fields = ['price', 'created_at']
 
    def perform_create(self, serializer):

         user_profile = self.request.user  

         if not user_profile.is_freelancer:
            # If not freelancer, block creation
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

# View for buyer's specific orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buyer_orders(request):
    try:
        orders = Order.objects.filter(buyer=request.user).order_by('-created_at')
        sections = {
            "pending": orders.filter(status="pending"),
            "ongoing": orders.filter(status="ongoing"),
            "complete": orders.filter(status="complete"),
        }
        result = {section: OrderSerializer(orders, many=True).data for section, orders in sections.items()}
        return Response(result, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# View for freelancer's specific orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def freelancer_orders(request):
    try:
        orders = Order.objects.filter(gig__freelancer=request.user).order_by('-created_at')
        sections = {
            "pending": orders.filter(status="pending"),
            "ongoing": orders.filter(status="ongoing"),
            "complete": orders.filter(status="complete"),
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

# View to repeat an order
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def repeat_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    # Check if the user is the buyer of the order
    if order.buyer != request.user:
        return Response({'error': 'Unauthorized to repeat this order'}, status=403)

    new_order = Order.objects.create(
        gig=order.gig,
        buyer=order.buyer,
        status='pending'  # New orders start as pending
    )
    serializer = OrderSerializer(new_order)
    return Response(serializer.data, status=201)

# View to update order status
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        if request.user != order.gig.freelancer:
            return Response({"error": "Only the freelancer can update the order status."}, status=403)
                
        new_status = request.data.get("status")
        if new_status not in ["pending", "ongoing", "complete"]:
            return Response({"error": "Invalid status"}, status=400)
        
        order.status = new_status
        order.save()
        return Response({"message": "Order status updated successfully"}, status=200)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# View to add a new order
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order(request, gig_id):
    try:
        gig = get_object_or_404(Gig, id=gig_id)
        buyer = request.user

        # Accept additional fields from the request body
        status = request.data.get("status", "pending")  # Defaults to "pending"
        
        # Validate the status (if applicable)
        if status not in ["pending", "ongoing", "complete"]:
            return Response({"error": "Invalid status"}, status=400)

        # Create the order
        order = Order.objects.create(
            gig=gig,
            buyer=buyer,
            status=status,
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
@permission_classes([])  # Public endpoint
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
    try:
        profile = user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    if profile.is_freelancer:
        return Response({'error': 'Only clients can create project posts.'}, status=403)
    data = request.data.copy()
    data['client'] = profile.id  # force assign current user as client
    serializer = ProjectPostSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_project_posts(request):
    user = request.user
    try:
        profile = user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    if profile.is_freelancer:
        projects = ProjectPost.objects.filter(is_open=True)
    else:
        projects = ProjectPost.objects.filter(client=profile)
    # Fetch filtering and sorting query params
    min_bid = request.GET.get('min_bid')
    max_bid = request.GET.get('max_bid')
    sort_by = request.GET.get('sort_by', 'date_desc')  # default to newest first
    result = []
    for project in projects:
        bids = project.bids.all()
        # Filter bids by amount range
        if min_bid:
            bids = bids.filter(bid_amount__gte=min_bid)
        if max_bid:
            bids = bids.filter(bid_amount__lte=max_bid)
        # Sort bids based on sort_by param
        if sort_by == 'amount_asc':
            bids = bids.order_by('bid_amount')
        elif sort_by == 'amount_desc':
            bids = bids.order_by('-bid_amount')
        elif sort_by == 'date_asc':
            bids = bids.order_by('created_at')
        else:  # 'date_desc' or unknown
            bids = bids.order_by('-created_at')
        project.bids_filtered = bids
        result.append(project)
    serializer = ProjectPostWithBidsSerializer(result, many=True, context={'bids_override': True})
    return Response(serializer.data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_bid(request, project_id):
    user = request.user
    try: # Check if user has a profile
        profile = user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    if not profile.is_freelancer: # Only freelancers can place bids
        return Response({'error': 'Only freelancers can place bids.'}, status=403)
    try:     # Check if project exists and is open
        project = ProjectPost.objects.get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if not project.is_open or project.accepted_bid is not None:
        return Response({'error': 'Bidding is closed for this project.'}, status=400)
    # Create the bid
    data = request.data.copy()
    data['project'] = project.id
    data['freelancer'] = profile.id
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
        profile = user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    try:
        bid = Bid.objects.select_related('project', 'freelancer').get(id=bid_id)
    except Bid.DoesNotExist:
        return Response({'error': 'Bid not found.'}, status=404)
    project = bid.project
    # Only the client who owns the project can accept the bid
    if project.client != profile:
        return Response({'error': 'You are not authorized to accept a bid for this project.'}, status=403)
    # Don't allow accepting a bid if one is already accepted
    if project.accepted_bid is not None:
        return Response({'error': 'A bid has already been accepted for this project.'}, status=400)
    # Accept the bid
    bid.is_accepted = True
    bid.save()
    project.accepted_bid = bid
    project.is_open = False
    project.save()
    return Response({
        'message': 'Bid accepted successfully.',
        'accepted_bid_id': bid.id,
        'project_id': project.id,
        'project_is_open': project.is_open
    }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_project_post(request, project_id):
    user = request.user
    try:
        profile = user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    try:
        project = ProjectPost.objects.get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if project.client != profile:
        return Response({'error': 'You are not authorized to update this project.'}, status=403)
    if not project.is_open:
        return Response({'error': 'Cannot update a project that is already closed.'}, status=400)
    serializer = ProjectPostSerializer(project, data=request.data)  # no partial=True
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project_post(request, project_id):
    user = request.user
    try:
        profile = user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    try:
        project = ProjectPost.objects.get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if project.client != profile:
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
        profile = user
    except CustomUser.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    try:
        project = ProjectPost.objects.select_related('accepted_bid').get(id=project_id)
    except ProjectPost.DoesNotExist:
        return Response({'error': 'Project not found.'}, status=404)
    if project.client != profile:
        return Response({'error': 'You are not authorized to reopen this project.'}, status=403)
    if project.accepted_bid is None:
        return Response({'error': 'No accepted bid to reject.'}, status=400)
    # Reverse the bid acceptance
    accepted_bid = project.accepted_bid
    accepted_bid.is_accepted = False
    accepted_bid.save()
    project.accepted_bid = None
    project.is_open = True
    project.save()
    return Response({
        'message': 'Project reopened and accepted bid rejected.',
        'project_id': project.id,
        'reopened': True
    }, status=200)
