from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    # path('signup/', views.signup_view, name='signup'),
    # path('login/', views.login_view, name='login'),
    path('buyer/orders/', BuyerOrdersView.as_view(), name='buyer_orders'),
    path('freelancer/orders/', FreelancerOrdersView.as_view(), name='freelancer_orders'),
    path('giglists/',list_giglists, name='list_giglists'),
    path('giglists/create/',create_giglist, name='create_giglist'),
    path('giglists/<int:list_id>/add/',add_gig_to_list, name='add_gig_to_list'),
    path('giglists/<int:list_id>/remove/',remove_gig_from_list, name='remove_gig_from_list'),
    path('giglists/<int:list_id>/delete/',delete_giglist, name='delete_giglist'),
    path('', include(router.urls)),
]
