import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

interface EventData {
  title: string;
  details: string;
  location: string;
  startDate: string;
  endDate: string;
  thumbnailUrl: string;
}

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [eventData, setEventData] = useState<EventData>({
    title: '',
    details: '',
    location: '',
    startDate: '',
    endDate: '',
    thumbnailUrl: '',
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/events/get/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch event details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEventDetails();
  }, [id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Inside FileChange");
    const cloudName = "dvrwupgzz";
    const presetName = "fr3ws4o";
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', presetName);
  
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log("Res:", data);
          setEventData(prev => ({ ...prev, thumbnailUrl: data.secure_url }));
        })
        .catch(error => console.log(error));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/events/update/${id}`, eventData, {
        headers: { authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Success',
        description: 'Event updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="500px" margin="auto" mt={8}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Details</FormLabel>
            <Textarea
              name="details"
              value={eventData.details}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              name="startDate"
              type="datetime-local"
              value={eventData.startDate}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>End Date</FormLabel>
            <Input
              name="endDate"
              type="datetime-local"
              value={eventData.endDate}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Thumbnail URL</FormLabel>
            <Input
              name="thumbnailUrl"
              value={eventData.thumbnailUrl}
              onChange={handleFileChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Update Event
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditEvent;