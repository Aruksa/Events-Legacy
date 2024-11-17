import React from "react";
import axios from "axios";
import logo from "../images/ui-1.svg";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { Search, Globe, Menu } from "lucide-react";
import { event, EventData } from "@/Interfaces/event";
import { createRef, useEffect, useState } from "react";
import DefaultSpinner from "@/components/DefaultSpinner";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";

function App() {
  const [page, setPage] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [loginUserId, setLoginUserId] = useState(0);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const pageSize = 30;

  // For debouncing title and location inputs
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [debouncedLocationValue, setDebouncedLocationValue] = useState("");

  const searchByTitleRef = createRef<HTMLInputElement>();
  const searchByLocationRef = createRef<HTMLInputElement>();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events`, {
        params: { page, pageSize },
      });
      const res = response.data.data;
      if (res) {
        const newEvents = res.map((event: event) => ({
          id: event.id,
          title: event.title,
          details: event.details,
          thumbnailUrl: event.thumbnailUrl,
          location: event.location,
          userId: event.userId,
          endDate: event.endDate,
          startDate: event.startDate,
        }));
        setEvents(newEvents);
      } else {
        throw new Error("Failed to fetch event details");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch the initial page of events
  useEffect(() => {
    fetchEvents();
  }, [page]);

  // Function to load more events when the user scrolls to the bottom
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For checking if the user is logged in
  useEffect(() => {
    setLoading(true);

    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/me", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsLogin(res.data.status);
        setLoginUserId(res.data.id);
      })
      .catch((error) => {
        console.log(error);
      });

    fetchEvents();
    setLoading(false);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationValue(event.target.value);
  };

  // Debounce for title input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // Debounce for location input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedLocationValue(locationValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [locationValue]);

  // Fetch search results based on title or location
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (!debouncedInputValue && !debouncedLocationValue) {
          await fetchEvents(); // Fetch all events if no input or location value
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/events`, {
          params: {
            title: debouncedInputValue || undefined,
            location: debouncedLocationValue || undefined,
          },
        });
        const searchResults = response.data.data;

        const newEvents = searchResults.map((event: EventData) => ({
          id: event.id,
          title: event.title,
          details: event.details,
          thumbnailUrl: event.thumbnailUrl,
          location: event.location,
          userId: event.userId,
          endDate: event.endDate,
          startDate: event.startDate,
        }));

        setEvents(newEvents);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [debouncedInputValue, debouncedLocationValue]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
  };

  if (isLoading)
    return (
      <div className="absolute top-[48%] left-[48%]">
        <DefaultSpinner />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-70">
            <div className="flex items-center gap-8 h-full">
              {/* Meetup Logo */}
              <a href="/" className="flex-shrink-0">
                <img src={logo} alt="Meetup Logo" className="h-8" />
              </a>
              {/* Search Bar */}
              <InputGroup>
                <Input
                  ref={searchByTitleRef}
                  type="text"
                  className="m-0 rounded-l-lg"
                  placeholder="Search by event title"
                  onChange={handleInputChange}
                />
                <Input
                  ref={searchByLocationRef}
                  type="text"
                  className="m-0"
                  rounded={"none"}
                  placeholder="Search by location"
                  onChange={handleLocationChange}
                />
                <InputRightAddon children={<Search className="h-5 w-5" />} />
              </InputGroup>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Globe className="h-5 w-5" />
                English
              </div>
              {isLogin ? (
                <>
                  <button className="bg-slate-300 text-black px-4 py-2 rounded-md hover:bg-slate-500">
                    <Link to="/createevent">Create Event</Link>
                  </button>
                  <button className="bg-slate-300 text-black px-4 py-2 rounded-md hover:bg-slate-500">
                    <Link to="/userevent">Your Event</Link>
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button className="text-gray-700 hover:text-gray-900">
                    <Link to="/login">Log in</Link>
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    <Link to="/signup">Sign up</Link>
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Menu */}
            <button className="md:hidden text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <EventCard
        events={events}
        setEvents={setEvents}
        loginUserId={loginUserId}
      />
    </div>
  );
}

export default App;
