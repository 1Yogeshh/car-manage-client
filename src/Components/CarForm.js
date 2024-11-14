import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CreateCarPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);  // Array to store selected images
  const [imgLoad, setImgLoad] = useState(false);
  const navigate=useNavigate()

  // Image change handler (for multiple images)
  const imgChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("You can only upload a maximum of 10 images.");
      return;
    }
    setImages(prevImages => [...prevImages, ...files]);
  };

  // Upload images to Cloudinary and get URLs
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload all images and get their URLs
    const urls = await uploadImages();
    if (!urls) {
      setLoading(false);
      return;  // Prevent form submission if image upload failed
    }

    try {
      const carData = {
        images: urls,  // Use the uploaded image URLs
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim())  // Split and trim tags if needed
      };

      // Send the data to the backend
      await api.post('/cars/create', carData, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert("Car posted successfully");
      navigate('/')
    } catch (error) {
      console.log('Error submitting form:', error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-black min-h-screen h-auto justify-center items-center w-full flex'>
      <div className='bg-white justify-center flex flex-col items-center min-h-[500px] rounded-md w-[600px] mt-10 mb-10 pb-10 pt-10'>
      <h2 className='font-medium text-xl'>Create New Car Post</h2>
      <form onSubmit={handleSubmit} className='flex flex-col'>
      <p className='font-medium'>Title</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          className='bg-[#f6f6f6] w-[450px] pt-2 pb-2 pl-2 pr-2 rounded-md mt-2'
          required
        />
        <p className='font-medium mt-2'>Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          className='bg-[#f6f6f6] w-[450px] pt-2 pb-2 pl-2 pr-2 rounded-md mt-2'
          required
        />
        <p className='font-medium mt-2'>Tags</p>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter Tags"
          className='bg-[#f6f6f6] w-[450px] pt-2 pb-2 pl-2 pr-2 rounded-md mt-2'
        />
        
        {/* File input allows multiple files */}
        <p className='font-medium mt-2'>Images</p>
        <input 
          type="file" 
          onChange={imgChange} 
          accept="image/*" 
          className='bg-[#f6f6f6] w-[450px] pt-2 pb-2 pl-2 pr-2 rounded-md mt-2'
          multiple 
          required
        />
        
        {/* Display the selected images as previews */}
        <div className="image-previews">
          {images.length > 0 && images.map((image, index) => (
            <div key={index} className="preview-image-container">
              <img 
                src={URL.createObjectURL(image)} 
                alt={`Preview ${index + 1}`}
                className="preview-image w-[450px] border rounded-md mt-2"
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className='bg-black text-white pt-2 pb-2 mt-6 rounded-md'>
          {loading ? 'Saving...' : 'Create'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default CreateCarPage;
