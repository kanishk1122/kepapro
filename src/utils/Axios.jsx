import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://kepapro-back-updaeted-1.onrender.com/',
});

// Function to retrieve the JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Add a request interceptor to include the JWT token from localStorage
instance.interceptors.request.use(
  config => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
