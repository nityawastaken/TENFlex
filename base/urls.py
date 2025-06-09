from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet
from . import views

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('', include(router.urls)),
]
