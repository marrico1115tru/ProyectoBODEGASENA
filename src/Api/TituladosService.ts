import axios from 'axios';
import { Titulado } from '@/types/types/typesTitulados';

const API_URL = 'http://localhost:3500/api/titulados';

export const getTitulados = async (): Promise<Titulado[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTitulado = async (titulado: Titulado): Promise<Titulado> => {
  const response = await axios.post(API_URL, titulado);
  return response.data;
};

export const updateTitulado = async (id: number, titulado: Titulado): Promise<Titulado> => {
  const response = await axios.put(`${API_URL}/${id}`, titulado);
  return response.data;
};

export const deleteTitulado = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
