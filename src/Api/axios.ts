// src/api/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Asegúrate de usar el dominio correcto
  withCredentials: true, // ✅ Esto envía automáticamente las cookies
});

export default axiosInstance;
