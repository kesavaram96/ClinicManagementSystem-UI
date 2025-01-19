import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7033/api', // Replace with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests if required
});

export default axiosInstance;
