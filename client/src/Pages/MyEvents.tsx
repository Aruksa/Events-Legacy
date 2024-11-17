import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EventData } from '@/Interfaces/event';
import React, { useEffect, useState } from 'react';
import emptyImage from '../../public/empty-folder.png';
import DefaultSpinner from '@/components/DefaultSpinner';
import { Button, ButtonGroup, Card, CardBody, CardFooter, Heading, Image, Stack, Text, useToast } from "@chakra-ui/react";

const YourEvents: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventData[]>([]);
  //const toast = useToast();

  
  
  const toast = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleCardClick = (eventId: number) => navigate(`/eventdetails/${eventId}`);

  const fetchYourEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/events/userevent', {
        headers: { authorization: `Bearer ${token}` }
      });

      console.log('res: ', response.data.data);
      if(response.data.data.length === 0){
        toast({
          title: 'Event',
          description: 'You have not create any events',
          status: 'error',
          duration: 5000
        })
      } else 
        setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching your events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your events",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //const toast = useToast();
    

    fetchYourEvents();
  }, []);
  
  if (isLoading) return <div className='absolute top-[48%] left-[48%]'><DefaultSpinner /></div>;

  const handleEditClick = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    navigate(`/editevent/${eventId}`);
  }

  const handleDeleteClick = async (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    const response = await axios.delete(`http://localhost:3000/api/events/delete/${eventId}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    const isDeleted = response.status === 200;
    if (!isDeleted) return;

  const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents([...updatedEvents]);

    toast({
      title: 'Event Deleted',
      description: `${response.data.message}`,
      status: 'warning',
      duration: 2000,
      isClosable: true,
    })
  }

  // useEffect(() => {
  //   //const toast = useToast();
  //   const fetchYourEvents = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const response = await axios.get('http://localhost:3000/api/events/userevent', {
  //         headers: { authorization: `Bearer ${token}` }
  //       });

  //       console.log('res: ', response.data.data);
  //       setEvents(response.data.data);
  //     } catch (error) {
  //       console.error('Error fetching your events:', error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to fetch your events. Please try again.",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchYourEvents();
  // }, []);
  // return (
  //   <Box maxWidth="800px" margin="auto" mt={8} p={4}>
  //     <Heading as="h1" mb={6}>Your Events</Heading>
  //     {events.length === 0 ? (
  //       <Text>You haven't created any events yet.</Text>
  //     ) : (
  //       <VStack spacing={4} align="stretch">
  //         {events.map((event) => (
  //           <Box key={event.id} p={4} borderWidth={1} borderRadius="md" shadow="md">
  //             <Heading as="h3" size="md">{event.title}</Heading>
  //             <Text mt={2}>{event.details}</Text>
  //             <Text mt={2}>Location: {event.location}</Text>
  //             <Button as={Link} to={`/edit-event/${event.id}`} mt={2} colorScheme="teal">
  //               Edit Event
  //             </Button>
  //           </Box>
  //         ))}
  //       </VStack>
  //     )}
  //   </Box>
  // );

  return (
    <div className="w-full mt-5">
      <div className="flex flex-wrap justify-center items-center mx-auto w-full gap-8">
        {events.length > 0 && events.map(res => (
          <Card className='cursor-pointer' 
            maxW='sm' 
            key={res.id} 
            onClick={() => handleCardClick(res.id)}>
            <CardBody>
              <Image
                className='m-auto h-[15rem]'
                src={res.thumbnailUrl ?? emptyImage}
                alt={res.title}
                objectFit='cover'
                borderRadius='lg'
              />
              <Stack mt='6' spacing='3'>
                <Heading size='md' className='max-h-[30px] truncate'>{res.title}</Heading>
                <Text className='h-[120px] overflow-scroll text-ellipsis[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>{res.details}</Text>
              </Stack>
            </CardBody>
            {/* <Divider /> */}
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button variant='solid' colorScheme='blue' onClick={async (e) => await handleEditClick(e, res.id)}>
                  Edit
                </Button>
                <Button variant='ghost' colorScheme='blue' onClick={async (e) => await handleDeleteClick(e, res.id)}>
                  Delete
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default YourEvents;