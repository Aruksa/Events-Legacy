from django.urls import path
from .views import EventsViewset

urlpatterns = [
    path('events/', EventsViewset.as_view()),
    path('events/<int:id>', EventsViewset.as_view()),
]
