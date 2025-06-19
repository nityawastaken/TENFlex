from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)
# router.register(r'users', UserViewSet)

urlpatterns = [
    # path('signup/', views.signup_view, name='signup'),
    # path('login/', views.login_view, name='login'),
    
    # Buyer and Freelancer Orders
    path('buyer/orders/', buyer_orders, name='buyer-orders'),  # Get buyer-specific orders
    path('freelancer/orders/', freelancer_orders, name='freelancer-orders'),  # Get freelancer-specific orders
    path('orders/<int:order_id>/', get_order, name='get-order'),  # Get a specific order
    path('orders/<int:order_id>/repeat/', repeat_order, name='repeat-order'),  # Repeat a specific order
    path('orders/<int:order_id>/update-status/', update_order_status, name='update-order-status'), # Update order status
    path('orders/gigs/<int:gig_id>/book/', add_order, name='add-order'), # Add a new order

    path('user/create/', create_profile_view, name='create-profile'),
    path('users/<int:pk>/', profile_detail_view, name='profile-detail'),
    # Gig list operations
    path('giglists/',list_giglists, name='giglist-list'),
    path('giglists/create/',create_giglist, name='giglist-create'),
    path('giglists/<int:list_id>/',detail_giglist, name='giglist-detail'),
    path('giglists/<int:list_id>/update/',rename_giglist, name='giglist-update'),
    path('giglists/<int:list_id>/delete/',delete_giglist, name='giglist-delete'),

    # Manage gigs inside a giglist
    path('giglists/<int:list_id>/gigs/add/',add_gig_to_list, name='giglist-gig-add'),
    path('giglists/<int:list_id>/gigs/remove/',remove_gig_from_list, name='giglist-gig-remove'),
    path('', include(router.urls)),
    
    #Post Bidding system
    path('projects/create/', create_project_post, name='create-project'),
    path('projects/', list_project_posts, name='list-projects'),
    path('projects/<int:project_id>/bid/', place_bid, name='place-bid'),
    path('bids/<int:bid_id>/accept/', accept_bid, name='accept-bid'),
    path('projects/<int:project_id>/update/', update_project_post, name='update-project'),
    path('projects/<int:project_id>/delete/', delete_project_post, name='delete-project'),
    path('projects/<int:project_id>/reopen/', reopen_project_post, name='reopen-project'),


]
