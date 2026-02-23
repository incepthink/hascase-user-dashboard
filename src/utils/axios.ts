import axios from "axios";

export const backendUrl = process.env.NODE_ENV === 'production' ? 'https://api.hashcase.co' : 'https://api.hashcase.co';  

const axiosInstance = axios.create({
  baseURL: backendUrl, // Set your API base URL her
});

export default axiosInstance;