import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Function to check if the token is expired
const isTokenExpired = token => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return false;
  }
};

// Create an axios instance
const instance = axios.create({
  baseURL: 'https://kepapro-back.onrender.com',
  withCredentials: true // Allow cookies to be sent with requests
});

// Add a request interceptor to include the JWT token
instance.interceptors.request.use(
  config => {
    let token = localStorage.getItem('jwtToken');
    if (token) {
      if (isTokenExpired(token)) {
        // Optionally: handle token refresh or logout
        // For now, we'll just remove the token
        localStorage.removeItem('jwtToken');
        token = null;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
