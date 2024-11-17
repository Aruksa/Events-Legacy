import axios from "axios";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [isLogin, setIsLogin] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
  };

  // For checking user is login or not
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/me", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("resData: ", res.data);
        setIsLogin(res.data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
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
            <Link to="/"></Link>Log out
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
  );
}

export default NavBar;
