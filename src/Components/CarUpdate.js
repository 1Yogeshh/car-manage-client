import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const UpdateCarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);  // Array for new images
  const [existingImages, setExistingImages] = useState([]);  // Array for existing images
  const [loading, setLoading] = useState(false);
  const [imgLoad, setImgLoad] = useState(false);

  // Fetch car details to prepopulate the form
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        const car = response.data;
        
        setTitle(car.title);
        setDescription(car.description);
        setTags(car.tags.join(', '));  // Assuming tags are stored as an array
        setExistingImages(car.images);  // Set existing images
      } catch (err) {
        console.error('Error fetching car details:', err);
      }
    };
    fetchCarDetails();
  }, [id]);

  // Image change handler for new images
  const imgChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("You can only upload a maximum of 10 images.");
      return;
    }
    setImages(prevImages => [...prevImages, ...files]);
  };

  // Upload images to Cloudinary
  const uploadImages = async () => {
    const uploadedUrls = [];
    try {
      setImgLoad(true);
      for (let i = 0; i < images.length; i++) {
        const data = new FormData();
        data.append('file', images[i]);
        data.append('upload_preset', 'evagczqi'); // Ensure the preset is correct

        const response = await fetch('https://api.cloudinary.com/v1_1/dom60njrq/image/upload', {
          method: 'POST',
          body: data,
        });

        const urlData = await response.json();
        uploadedUrls.push(urlData.secure_url); // Add URL to array
      }
      setImgLoad(false);
      return uploadedUrls; // Return the array of image URLs
    } catch (error) {
      console.error("Image upload failed: ", error);
      setImgLoad(false);
      return null;
    }
  };

  // Remove an image from the list of existing images
  const removeImage = (imageToRemove) => {
    setExistingImages(existingImages.filter(image => image !== imageToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload new images and get their URLs
    const newImageUrls = await uploadImages();

    if (!newImageUrls) {
      setLoading(false);
      return;  // Prevent form submission if image upload failed
    }

    const allImages = [...existingImages, ...newImageUrls];

    try {
      const carData = {
        images: allImages,  // Updated list of images
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim())  // Split and trim tags if needed
      };

      // Send the updated data to the backend
      await api.put(`/cars/${id}`, carData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("Car updated successfully");
      alert("Car updated successfully")
      navigate(`/cars/${id}`);  // Redirect to the car details page after update
    } catch (error) {
      console.log('Error updating car:', error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-black text-white pt-6 pl-6 min-h-screen h-auto'>
      <h2 className='text-lg'>Update Car Details</h2>
      <form onSubmit={handleSubmit} className='flex flex-col'>
      <p className='mt-4 font-medium'>Title</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className='bg-[#f6f6f6] mt-2 w-[500px] rounded pt-1 pb-1 pl-2 pr-2 text-black'
          required
        />
        <p className='mt-4 font-medium'>Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className='bg-[#f6f6f6] mt-2 w-[500px] rounded pt-1 pb-1 pl-2 pr-2 text-black'
          required
        />
        <p className='mt-4 font-medium'>Tags</p>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className='bg-[#f6f6f6] w-[500px] rounded mt-2 pt-1 pb-1 pl-2 pr-2 text-black'
        />

        {/* File input allows multiple files */}
        <p className='mt-4 font-medium'>Images</p>
        <input
          type="file"
          onChange={imgChange}
          accept="image/*"
          className='bg-[#f6f6f6] w-[500px] mt-2 rounded mb-4 pt-1 pb-1 pl-2 pr-2 text-black'
          multiple
        />

        {/* Display previews of existing images */}
        <div className="image-previews flex flex-wrap gap-6">
          {existingImages.length > 0 && existingImages.map((image, index) => (
            <div key={index} className="preview-image-container w-[300px] h-[300px] rounded">
              <img
                src={image}
                alt={`Existing Image ${index + 1}`}
                className="preview-image"
              />
              <button type="button" onClick={() => removeImage(image)} className='bg-red-500 pt-1 pl-2 pr-2 pb-1 rounded-md mt-4'>Remove</button>
            </div>
          ))}
        </div>

        {/* Display new image previews */}
        <div className="image-previews flex flex-wrap gap-6">
          {images.length > 0 && images.map((image, index) => (
            <div key={index} className="preview-image-container w-[300px] h-[300px] rounded">
              <img
                src={URL.createObjectURL(image)}
                alt={`New Image ${index + 1}`}
                className="preview-image"
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className='bg-blue-500 mb-6 pt-2 pb-2 w-[500px] rounded-md'>
          {loading ? 'Saving...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default UpdateCarPage;
