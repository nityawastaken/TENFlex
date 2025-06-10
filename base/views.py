from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .forms import SignUpForm
from .serializers import ReviewSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Review, Order
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

# View for sign up
class SignUpView(FormView):
    template_name = 'accounts/signup.html' # Name of the HTML file can be changed according to the frontend
    form_class = SignUpForm
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return super().form_valid(form)
    
# View for login
class CustomLoginView(LoginView):
    template_name = 'accounts/login.html' # Name of the HTML file can be changed according to the frontend
    authentication_form = AuthenticationForm

    def get_success_url(self):
        return reverse_lazy('home')  # Redirect to home or any other page after login
    
#view for Reviews
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Assign user here

# View for your orders list
class BuyerOrdersView(LoginRequiredMixin, TemplateView):
    template_name = 'accounts/buyer_orders.html' # Name of the HTML file can be changed according to the frontend

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['orders'] = Order.get_orders_summary(self.request.user, "buyer")
        return context

# View for orders for you list
class FreelancerOrdersView(LoginRequiredMixin, TemplateView):
    template_name = 'accounts/freelancer_orders.html' # Name of the HTML file can be changed according to the frontend

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['orders'] = Order.get_orders_summary(self.request.user, "freelancer")
        return context
