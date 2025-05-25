import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Sửa lại baseURL nếu cần
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;