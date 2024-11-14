import React, { useState, useEffect } from 'react';
import api from '../api';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/cars/cars', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(response.data);
        setFilteredCars(response.data); // Initially, set filteredCars to all cars
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching cars', err);
      }
    };
    fetchCars();
  }, []);

  // Handle search results by filtering cars based on the search term
  const handleSearchResults = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    const results = cars.filter((car) => {
      return (
        car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    console.log('Filtered cars:', results);
    setFilteredCars(results);
  };
  

  return (
    <div>
      <SearchBar onSearchResults={handleSearchResults} />
      <ul className='flex flex-wrap gap-8 justify-center mt-10'>
        {filteredCars.map((car) => (
          <li key={car._id} className="mb-8 w-[450px] h-[350px] shadow-lg rounded-md">
            {/* Slider for car images */}
            <Link to={`/cars/${car._id}`} className="text-blue-500 mt-4 inline-block">
            <ImageSlider images={car.images} />
            <p className='font-medium text-black ml-4 mt-2s'> {car.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop back to first image
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    ); // Loop back to last image
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Car ${currentIndex + 1}`}
        className="w-full h-64 object-cover rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 flex justify-between items-center px-4">
        <button
          onClick={prevImage}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          &#10094;
        </button>
        <button
          onClick={nextImage}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default CarList;
