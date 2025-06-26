# reviews,Gig/filters.py
import django_filters
from .models import Review,Gig

class ReviewFilter(django_filters.FilterSet):
    reviewer_id = django_filters.NumberFilter(field_name='reviewer__id')
    reviewee_id = django_filters.NumberFilter(field_name='reviewee__id')
    gig_id = django_filters.NumberFilter(field_name='gig__id')  # optional

    class Meta:
        model = Review
        fields = ['reviewer_id', 'reviewee_id', 'gig_id']


class GigFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    delivery_time_min = django_filters.NumberFilter(field_name='delivery_time', lookup_expr='gte')
    delivery_time_max = django_filters.NumberFilter(field_name='delivery_time', lookup_expr='lte')

    location = django_filters.CharFilter(field_name='freelancer__location', lookup_expr='icontains')

    class Meta:
        model = Gig
        fields = ['price_min', 'price_max', 'delivery_time_min', 'delivery_time_max', 'location']

