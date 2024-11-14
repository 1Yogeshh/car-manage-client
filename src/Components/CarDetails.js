import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem('userId');
  console.log("Logged in user ID:", loggedInUserId);

  useEffect(() => {
    const fetchCar = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get(`/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(response.data);
        console.log(response.data);
        
      } catch (err) {
        console.error('Error fetching car', err);
      }
    };
    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Car deleted successfully");
      alert("Car deleted successfully")
      navigate('/');  // Redirect after deletion
    } catch (err) {
      console.error('Error deleting car', err);
    }
  };

  const handleUpdate = () => {
    navigate(`/cars/update/${id}`);
  };

  return (
    <div className='bg-black h-screen text-white  flex flex-col justify-center items-center'>
      {car ? (
        <>
          {/* Image Slider */}
          {car.images && car.images.length > 0 ? (
            <ImageSlider images={car.images} />
          ) : (
            <p>No images available for this car</p>
          )}
          
          {/* Car Details */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold">Title: {car.title}</h2>
            <p className="text-gray-600">Description: {car.description}</p>
            <p>Tages: {car.tags}</p>

            {/* Conditionally render Update and Delete buttons */}
            {car.user._id === loggedInUserId && (
              <div className="mt-4 flex w-full">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg w-[400px] hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-[400px] ml-2"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading car details...</p>
      )}
    </div>
  );
};

// ImageSlider Component
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Car ${currentIndex + 1}`}
        className="w-full h-80 object-cover rounded-lg shadow-lg"
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

export default CarDetail;
