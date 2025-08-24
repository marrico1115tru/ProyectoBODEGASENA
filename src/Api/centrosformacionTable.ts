import axiosInstance from "./../Api/axios"; 
import {
  CentroFormacion,
  CentroFormacionFormValues,
} from '@/types/types/typesCentroFormacion'; 

export const getCentrosFormacion = async (): Promise<CentroFormacion[]> => {
  const res = await axiosInstance.get('/centro-formacion');
  return res.data;
};

export const createCentroFormacion = async (
  data: CentroFormacionFormValues
): Promise<CentroFormacion> => {

  const res = await axiosInstance.post('/centro-formacion', data);
  return res.data;
};

export const updateCentroFormacion = async (
  id: number,
  data: CentroFormacionFormValues
): Promise<CentroFormacion> => {
  const res = await axiosInstance.put(`/centro-formacion/${id}`, data);
  return res.data;
};

export const deleteCentroFormacion = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/centro-formacion/${id}`);
};