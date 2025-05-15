import axios from 'axios';
import { Usuario } from '@/types/types/Usuario';

const API_URL = 'http://localhost:3500/api/usuarios';

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createUsuario = async (usuario: Usuario): Promise<Usuario> => {
  const response = await axios.post(API_URL, usuario);
  return response.data;
};

export const updateUsuario = async (id: number, usuario: Usuario): Promise<Usuario> => {
  const response = await axios.put(`${API_URL}/${id}`, usuario);
  return response.data;
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
