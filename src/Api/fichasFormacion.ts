import axios from 'axios';
import { FichaFormacion } from '@/types/types/FichaFormacion';

const API_URL = 'http://localhost:3500/api/fichas';

// ✅ Obtener todas las fichas
export const getFichasFormacion = async (): Promise<FichaFormacion[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ✅ Crear una nueva ficha
export const createFichaFormacion = async (ficha: FichaFormacion): Promise<FichaFormacion> => {
  const response = await axios.post(API_URL, ficha);
  return response.data;
};

// ✅ Actualizar una ficha por ID
export const updateFichaFormacion = async (id: number, ficha: FichaFormacion): Promise<FichaFormacion> => {
  const response = await axios.put(`${API_URL}/${id}`, ficha);
  return response.data;
};

// ✅ Eliminar una ficha por ID
export const deleteFichaFormacion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
