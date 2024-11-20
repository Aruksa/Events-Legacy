from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from . import models
from . import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from dj_rest_auth.views import LoginView
from rest_framework_simplejwt.tokens import RefreshToken
from dj_rest_auth.registration.views import RegisterView
from rest_framework.permissions import AllowAny


class EventsViewset(APIView):
    # Default permission is set at the class level
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """
        Override to specify different permissions for GET requests (public access)
        """
        if self.request.method in ['GET']:
            return []  # No permission required for GET requests
        return super().get_permissions()  # Apply default permissions for other methods

    def get(self, request, id=None):

        if id:
            item = models.Events.objects.get(id=id)
            serializer = serializers.EventsSerializer(item)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        items = models.Events.objects.all()
        serializer = serializers.EventsSerializer(items, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user  # Access the authenticated user

        genre_ids = request.data.pop("genreId", [])

        # Add the user ID to the event data
        event_data = request.data
        event_data['user'] = user.id  # Assign the user ID to the event

        serializer = serializers.EventsSerializer(data=event_data)

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

        # Check if the current user is the creator of the event
        if item.user_id != request.user.id:
            return Response({"status": "error", "message": "You do not have permission to edit this event."}, status=status.HTTP_403_FORBIDDEN)

        serializer = serializers.EventsSerializer(
            item, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        try:
            item = models.Events.objects.get(id=id)
        except models.Events.DoesNotExist:
            return Response({"status": "error", "message": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the current user is the creator of the event
        if item.user_id != request.user.id:  # Use `user_id` here
            return Response({"status": "error", "message": "You do not have permission to delete this event."}, status=status.HTTP_403_FORBIDDEN)
        item.delete()
        return Response({"status": "success", "data": "Item Deleted"})


class CustomLoginView(LoginView):
    def get_response(self):
        # Call the parent method to get the original response
        response = super().get_response()

        # Now that the user is logged in, add the JWT tokens to the response
        user = self.user  # The user object is automatically set in LoginView
        refresh = RefreshToken.for_user(user)
        response.data['access'] = str(refresh.access_token)
        response.data['refresh'] = str(refresh)

        return response


class CustomRegisterView(RegisterView):
    permission_classes = [AllowAny]  # Allow public access to register

    def get_response(self):
        # You can add additional fields to the response, such as JWT tokens
        response = super().get_response()

        # You may want to add JWT tokens or other data to the response
        user = self.user  # Automatically set during the registration
        refresh = RefreshToken.for_user(user)
        response.data['access'] = str(refresh.access_token)
        response.data['refresh'] = str(refresh)

        return response
