import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use react-router's useNavigate hook
import CarList from './CarList';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]);

  return (
    <>
      <header>
        <nav className='flex justify-between pl-20 pr-20 pt-4 pb-4 bg-black text-white font-medium'>
          <a>Car-Manage</a>
          <div className='flex gap-6'>
            <a href="/create-car">Create a Post</a>
          </div>
        </nav>
      </header>

      {/* Render CarList if authenticated, otherwise null */}
      {isAuthenticated ? <CarList /> : null}
    </>
  );
};

export default Header;
