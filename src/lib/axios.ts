import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // 🔥 MUY importante para enviar cookies (el JWT)
});

export default api;
