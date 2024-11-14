// src/components/LoginPage.js
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      console.log(response.data.userId);
      alert("login successfully")
      navigate('/')
      
    } catch (err) {
      console.error('Error during login', err);
    }
  };

  return (
    <div className='bg-black h-screen w-full flex justify-center items-center'>
      <div className='flex flex-col pl-4 pr-4 pt-4 bg-white rounded-md h-[400px] w-[390px]'>
      <h2 className='font-medium text-lg'>Login Car-Management</h2>
      <form onSubmit={handleSubmit} className='flex flex-col'>
      <p className='font-medium mt-4'>Email address </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='font-medium bg-[#f6f6f6] pt-2 pb-2 pl-2 pr-2 mt-4'
        />
        <p className='font-medium mt-4'>Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='font-medium bg-[#f6f6f6] pt-2 pb-2 pl-2 pr-2 mt-4'
          required
        />
        <button type="submit" className='bg-black text-white font-medium pt-2 pb-2 mt-8'>Login</button>
        <p className='flex justify-center mt-4 gap-2 font-medium'>Have not account? <a href='/signup' className='underline'>Signup</a></p>
      </form>
      </div>
    </div>
  );
};

export default Login;
