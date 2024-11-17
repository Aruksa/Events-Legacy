import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://localhost:3000/api/users/signup", {
      username,
      email,
      password
    }).then(response => {
      toast({
        title: 'SignUp ',
        description: 'User signup successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      if(response.data) {
        navigate('/login')
      }
    }).catch(err => {
      toast({
        title: 'SignUp failed',
        description: 'Username and Email must be unique',
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
        <h2 className="heading">Sign Up</h2>
        <label htmlFor="username" className="heading">Username:</label>
        <input
          type="text"
          placeholder="Username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button type="submit" className="signup">Sign Up</button>
        <p className="heading">Have an Account? <Link to="/login">Login</Link></p> 
      </form>
    </div>
  );
};

export default Register;