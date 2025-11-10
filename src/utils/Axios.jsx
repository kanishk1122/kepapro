import axios from "axios";

const instance = axios.create({
  baseURL:  "http://localhost:8888/",
  withCredentials: true, // Important: send cookies with requests
});

// No need for Authorization header with session-based auth
// Cookies are automatically sent with each request

export default instance;
