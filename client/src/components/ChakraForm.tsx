import axios from 'axios';
import { useEffect, useState } from 'react';
import emptyImage from '../../public/empty-folder.png';
import { useNavigate, useParams } from 'react-router-dom';
import { removeZFromUTCDateString } from '@/common/dateExtensions';
import { Button, FormControl, FormLabel, Image, Input, Textarea, useToast } from '@chakra-ui/react';

interface EventData {
    title: string;
    details: string;
    location: string;
    startDate: string;
    endDate: string;
    thumbnailUrl: string;
}

const ChakraForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
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
                setEventData(response.data.data);
                console.error(response.data.data);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("inside Filechange");
        const cloudName = "dvrwupgzz";
        const presetName = "fr3ws4o";
        if (e.target.files && e.target.files) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', presetName);
            axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
                .then(res => {
                    console.log("Res: ", res.data);
                    setEventData(prev => ({ ...prev, thumbnailUrl: res.data.secure_url }))
                })
                .catch(err => console.log(err));
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
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
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold my-4">Update The Event</h2>
            <div className='flex flex-col md:flex-row gap-8'>
                <form className='w-[60%]' onSubmit={handleSubmit}>
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
                            value={removeZFromUTCDateString(eventData.startDate)}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>End Date</FormLabel>
                        <Input
                            name="endDate"
                            type="datetime-local"
                            value={removeZFromUTCDateString(eventData.endDate)}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="teal">
                        Update Event
                    </Button>
                </form>
                <div className="flex-1 mt-8 md:mt-0">
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <Image
                            className='m-auto object-cover max-h-[300px]'
                            src={eventData.thumbnailUrl ?? emptyImage}
                            alt="Event Preview"
                        />
                        <div>
                            <input
                                type="file"
                                id="picture"
                                name="picture"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChakraForm;