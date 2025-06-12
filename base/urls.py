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
]
