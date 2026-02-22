import axios from "axios";

export const backendUrl = process.env.NODE_ENV === 'production' ? 'https://api.hashcase.co' : 'http://localhost:8000';  

const axiosInstance = axios.create({
  baseURL: backendUrl, // Set your API base URL her
});

export default axiosInstance;