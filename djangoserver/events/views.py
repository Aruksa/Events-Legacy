from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from . import models
from . import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class EventsViewset(APIView):
    def get(self, request, id=None):
        if id:
            item = models.Events.objects.get(id=id)
            serializer = serializers.EventsSerializer(item)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        items = models.Events.objects.all()
        serializer = serializers.EventsSerializer(items, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        genre_ids = request.data.pop("genreId", [])
        serializer = serializers.EventsSerializer(data=request.data)

        if serializer.is_valid():
            event = serializer.save()
            if genre_ids:
                for genre_id in genre_ids:
                    genre = models.Genres.objects.filter(id=genre_id).first()
                    if genre:  # Ensure the genre exists
                        models.EventsGenres.objects.create(
                            event_id=event, genre_id=genre)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        try:
            item = models.Events.objects.get(id=id)
        except models.Events.DoesNotExist:
            return Response({"status": "error", "message": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.EventsSerializer(
            item, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        item = models.Events.objects.filter(id=id)
        print(item)
        item.delete()
        return Response({"status": "success", "data": "Item Deleted"})
