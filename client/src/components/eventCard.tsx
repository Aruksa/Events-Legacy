import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { EventData } from '../Interfaces/event';
import emptyImage from '../../public/empty-folder.png';
import { Button, ButtonGroup, Card, CardBody, CardFooter, Heading, Image, Stack, Text, useToast } from "@chakra-ui/react";

interface EventCardProps {
  events: EventData[],
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>
  loginUserId: number
}

const EventCard = (props: EventCardProps) => {
  const { events, setEvents, loginUserId } = props;

console.log('card: ', events);
  const toast = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleCardClick = (eventId: number) => navigate(`/eventdetails/${eventId}`);

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



  return (
    <div className="w-full mt-5">
      <div className="flex flex-wrap justify-center items-center mx-auto w-full gap-8">
      {events.length > 0 && events.map((res) => (
      <Card className='cursor-pointer' maxW='sm' key={res.id} onClick={() => handleCardClick(res.id)}>
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
        {res.userId === loginUserId ? (
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
        ) : (
          <CardFooter>
            <ButtonGroup spacing='2'></ButtonGroup>
          </CardFooter>)}
      </Card>))}
      </div>
    </div>
  );}

export default EventCard;