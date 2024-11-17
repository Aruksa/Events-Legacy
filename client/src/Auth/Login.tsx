import React, { useState } from "react";
import "../App.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()
  const toast = useToast();
  
  Axios.defaults.withCredentials = true;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/api/users/login", {
      email,
      password
    }).then(response => {
      if(response.data) {
          //console.log(response.data);
          localStorage.setItem("token", response.data.token);
          navigate('/')
          toast({
            title: 'Login',
            description: 'User Login Successfull',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        }
    }).catch(err => {
      toast({
        title: 'Login Failed',
        description: 'Please enter your correct email or password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
        console.log(err)
    })
  };


  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2 className="heading">Loign</h2>

        <label htmlFor="email" className="heading">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="heading">Password:</label>
        <input
          type="password"
          placeholder="******"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login">Login</button>
        <p className="heading">Don't Have Account? <Link to="/signup">Sign Up</Link></p> 
      </form>
    </div>
  );
};

export default Login;