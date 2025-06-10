from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, BuyerOrdersView, FreelancerOrdersView
from . import views

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('buyer/orders/', BuyerOrdersView.as_view(), name='buyer_orders'),
    path('freelancer/orders/', FreelancerOrdersView.as_view(), name='freelancer_orders'),
    path('', include(router.urls)),
]
