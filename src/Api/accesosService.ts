import axios from 'axios';
import { Acceso } from '@/types/types/acceso';

const API_URL = 'http://localhost:3500/api/accesos';

export const getAccesos = async (): Promise<Acceso[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getAccesoById = async (id: number): Promise<Acceso> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createAcceso = async (acceso: Omit<Acceso, 'id'>): Promise<Acceso> => {
  const response = await axios.post(API_URL, acceso);
  return response.data;
};

export const updateAcceso = async (id: number, acceso: Omit<Acceso, 'id'>): Promise<Acceso> => {
  const response = await axios.put(`${API_URL}/${id}`, acceso);
  return response.data;
};

export const deleteAcceso = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
