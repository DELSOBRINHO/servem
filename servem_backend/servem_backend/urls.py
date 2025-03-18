from django.urls import path
from api.views import get_users, get_church_programs, get_event_volunteers, get_notifications, get_analytics


urlpatterns = [
    path('users/', get_users, name='get_users'),
    path('church_programs/', get_church_programs, name='get_church_programs'),
    path('event_volunteers/', get_event_volunteers, name='get_event_volunteers'),
    path('notifications/', get_notifications, name='get_notifications'),
    path('analytics/', get_analytics, name='get_analytics'),
]
