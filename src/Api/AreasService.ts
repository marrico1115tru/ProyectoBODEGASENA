import axios from 'axios';
import { Area, AreaFormValues } from '@/types/types/typesArea';

// Crear instancia de Axios con configuración para usar cookies
const api = axios.create({
  baseURL: 'http://localhost:3000', // cambia si tu backend tiene otra URL
  withCredentials: true,            // 🔐 incluye cookies en cada request
});

// Obtener todas las áreas
export const getAreas = async (): Promise<Area[]> => {
  const res = await api.get('/areas');
  return res.data?.data || res.data; // ajusta si tu backend responde diferente
};

// Crear nueva área
export const createArea = async (data: AreaFormValues) => {
  await api.post('/areas', data);
};

// Actualizar un área existente
export const updateArea = async (id: number, data: AreaFormValues) => {
  await api.put(`/areas/${id}`, data);
};

// Eliminar un área
export const deleteArea = async (id: number) => {
  await api.delete(`/areas/${id}`);
};
