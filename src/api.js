import axios from 'axios';

const api = axios.create({
  baseURL: 'https://car-manage-server.vercel.app', // Adjust this based on your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Get token from localStorage (or wherever it's stored)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;