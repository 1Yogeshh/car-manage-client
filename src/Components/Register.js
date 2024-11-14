// src/components/SignupPage.js
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]=useState('')
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password,
        name
      });
      console.log(response.data);
      navigate('/login')
      console.log("regsiter successfully");
      
    } catch (err) {
      console.error('Error during signup', err);
    }
  };

  return (
    <div className='bg-black flex justify-center items-center h-screen w-full'>
      <div className='bg-white flex flex-col pl-4 pr-4 pt-4  h-[500px] w-[450px] rounded-md'>
      <h2 className='text-lg font-medium'>Register Car-Management</h2>
      <form onSubmit={handleSubmit} className='flex flex-col'>
      <p className='font-medium mt-4'>Name</p>
      <input
            type='text'
            placeholder='name'
            value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className='font-medium bg-[#f6f6f6] pt-2 pb-2 pl-2 pr-2 mt-4'
        />
        <p className='font-medium mt-2'>Username</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='font-medium bg-[#f6f6f6] pt-2 pb-2 pl-2 pr-2 mt-4'
        />
        <p className='font-medium mt-2'>Email</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='font-medium bg-[#f6f6f6] pt-2 pb-2 pl-2 pr-2 mt-4'
        />
        <p className='font-medium mt-2'>Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='font-medium bg-[#f6f6f6] pt-2 pb-2 pl-2 pr-2 mt-4'
        />
        
        <button type="submit" className='pt-2 pb-2 bg-black text-white font-medium mt-4 rounded'>Sign Up</button>
        <p className='flex justify-center mt-2 gap-2 font-medium'>Do you have already account?<a className=' underline' href='/login'>Login</a></p>
      </form>
      </div>
    </div>
  );
};

export default Register;
