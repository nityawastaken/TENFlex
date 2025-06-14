from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import *
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from .filters import ReviewFilter
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import CanViewOrEditProfile

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

        if reviewer_id:
            deleted_count, _ = Review.objects.filter(reviewer__id=reviewer_id).delete()
            return Response(
                {"message": f"{deleted_count} reviews deleted for reviewer_id {reviewer_id}"},
                status=status.HTTP_204_NO_CONTENT
            )
        elif reviewee_id:
            deleted_count, _ = Review.objects.filter(reviewee__id=reviewee_id).delete()
            return Response(
                {"message": f"{deleted_count} reviews deleted for reviewee_id {reviewee_id}"},
                status=status.HTTP_204_NO_CONTENT
            )

        return super().destroy(request, *args, **kwargs)


# View for client orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buyer_orders(request):
    orders = Order.get_orders_summary(request.user, "client")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# View for freelancer orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def freelancer_orders(request):
    orders = Order.get_orders_summary(request.user, "freelancer")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# View to repeat orders
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def repeat_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id, buyer=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found or unauthorized'}, status=404)

    new_order = order.repeat_order()
    return Response(OrderSerializer(new_order).data, status=201)

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User_profile.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly] 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile_view(request):
    user = request.user

    if hasattr(user, 'user_profile'):
        return Response({'detail': 'Profile already exists.'}, status=400)

    data = request.data.copy()
    data['user'] = user.id
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile_detail_view(request, pk):
    from django.shortcuts import get_object_or_404
    profile = get_object_or_404(User_profile, pk=pk)

    permission = CanViewOrEditProfile()
    if request.method == 'GET':
        if not permission.has_object_permission(request, None, profile):
            return Response({'detail': 'You do not have permission to view this profile.'}, status=403)
        serializer = UserSerializer(profile)
        return Response(serializer.data)

    if profile.user != request.user:
        return Response({'detail': 'You do not have permission to modify this profile.'}, status=403)

    if request.method in ['PUT', 'PATCH']:
        serializer = UserSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        profile.delete()
        return Response({'detail': 'Profile deleted successfully.'}, status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_giglists(request):
    giglists = GigList.objects.filter(user=request.user)
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
