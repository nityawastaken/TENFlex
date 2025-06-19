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
    class Meta:
        model = Gig
        fields = ['duration', 'location', 'language']

