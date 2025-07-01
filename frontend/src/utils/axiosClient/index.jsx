import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const lang = localStorage.getItem('language') || 'vi';
  config.headers['Accept-Language'] = lang;
  return config;
});

export default axiosClient;
