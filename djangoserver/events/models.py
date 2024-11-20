from django.db import models

# Create your models here.


class Events(models.Model):
    title = models.CharField(max_length=100)
    details = models.CharField(max_length=255)
    thumbnailUrl = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    user_id = models.IntegerField()


class Genres(models.Model):
    name = models.CharField(max_length=100)


class EventsGenres(models.Model):
    event_id = models.ForeignKey(Events, on_delete=models.CASCADE)
    genre_id = models.ForeignKey(Genres, on_delete=models.SET_NULL, null=True)
