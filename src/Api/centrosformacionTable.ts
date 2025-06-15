import axios from 'axios';
import { CentroFormacion, CentroFormacionFormValues } from '../types/types/typesCentroFormacion';

const API_URL = 'http://localhost:3000/centro-formacion';

export const getCentrosFormacion = async (): Promise<CentroFormacion[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createCentroFormacion = async (data: CentroFormacionFormValues): Promise<CentroFormacion> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateCentroFormacion = async (id: number, data: CentroFormacionFormValues): Promise<CentroFormacion> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteCentroFormacion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
