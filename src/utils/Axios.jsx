import axios from 'axios';
import { decode as jwtDecode } from 'jwt-decode';

const instance = axios.create({
  baseURL: 'https://kepapro-back.onrender.com',
  withCredentials: true // Allow cookies to be sent with requests
});

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

// Function to refresh the token
const refreshAuthToken = async () => {
  try {
    const response = await axios.post('https://kepapro-back.onrender.com/refresh-token', {}, {
      withCredentials: true
    });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing token', error);
    return null;
  }
};

// Add a request interceptor to include the JWT token
instance.interceptors.request.use(
  async config => {
    let token = localStorage.getItem('token');

    if (token && isTokenExpired(token)) {
      token = await refreshAuthToken();

      if (!token) {
        localStorage.removeItem('jwtToken');
        // Optionally redirect to login or notify user
        console.log('Token expired, please log in again');
      }
    }

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
