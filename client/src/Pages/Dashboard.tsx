import React, { useState, useEffect, createRef } from "react";
import axios from "axios";
import logo from "../images/ui-1.svg";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { Search, Globe, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import DefaultSpinner from "@/components/DefaultSpinner";

function App() {
  useEffect(() => {
    document.title = "Home | Meetup";
  }, []);

  const [page, setPage] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [loginUserId, setLoginUserId] = useState(0);

  // For debouncing title and location inputs
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [debouncedLocationValue, setDebouncedLocationValue] = useState("");

  const searchByTitleRef = createRef<HTMLInputElement>();
  const searchByLocationRef = createRef<HTMLInputElement>();

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

  // Fetch events using TanStack Query

  const fetchEvents = async ({ queryKey }: { queryKey: any }) => {
    const [_key, { page, title, location }] = queryKey;

    // Clear filters when input fields are empty
    const params: Record<string, any> = { page, pageSize: 30 };
    if (title) params.title = title;
    if (location) params.location = location;

    const response = await axios.get("http://localhost:3000/api/events", {
      params,
    });
    return response.data.data;
  };

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", { page, title: debouncedInputValue, location: debouncedLocationValue }],
    queryFn: fetchEvents,
  });

  // Check user login status
  useEffect(() => {
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
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationValue(event.target.value);
  };

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
                  value={inputValue} // Bind to state
                  onChange={handleInputChange} // Update state
                />
                <Input
                  ref={searchByLocationRef}
                  type="text"
                  className="m-0"
                  rounded={"none"}
                  placeholder="Search by location"
                  value={locationValue} // Bind to state
                  onChange={handleLocationChange} // Update state
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
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    onClick={() => {
                      logout();
                    }}>
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

      {/* Events List */}
      <EventCard events={events} setEvents={() => {}} loginUserId={loginUserId} />

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {page > 1 && (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600" onClick={() => setPage((prev) => prev - 1)}>
            Previous
          </button>
        )}
        <span className="px-4 py-2">{`Page ${page}`}</span>
        {events.length > 30 && (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2 hover:bg-blue-600" onClick={() => setPage((prev) => prev + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
