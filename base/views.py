from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import *
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Assign user here

# View for client orders
class BuyerOrdersView(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.get_orders_summary(self.request.user, "client")

# View for freelancer orders
class FreelancerOrdersView(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['orders'] = Order.get_orders_summary(self.request.user, "freelancer")
        return context


class UserViewSet(viewsets.ModelViewSet):
    queryset = User_profile.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] 

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
