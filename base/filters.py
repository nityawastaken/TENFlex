# reviews/filters.py
import django_filters
from .models import Review

class ReviewFilter(django_filters.FilterSet):
    reviewer_id = django_filters.NumberFilter(field_name='reviewer__id')
    reviewee_id = django_filters.NumberFilter(field_name='reviewee__id')
    gig_id = django_filters.NumberFilter(field_name='gig__id')  # optional

    class Meta:
        model = Review
        fields = ['reviewer_id', 'reviewee_id', 'gig_id']
