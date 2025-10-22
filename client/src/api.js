// simple API wrapper
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
});

export default API;
