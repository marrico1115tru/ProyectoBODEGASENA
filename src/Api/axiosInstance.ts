import axios from 'axios';

/**
 * Esta instancia incluye automáticamente la cookie HttpOnly
 * que tu backend coloca tras el login (gracias a withCredentials).
 * NO se envía encabezado Authorization.
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,               // ←  envía cookie al backend
  headers: { 'Content-Type': 'application/json' },
});
