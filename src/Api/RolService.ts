import axiosInstance from './../Api/axios'; 
import { Rol, RolFormValues } from '@/types/types/Rol'; 



export const getRoles = async (): Promise<Rol[]> => {
  const res = await axiosInstance.get('/roles');
  return res.data;
};

export const createRol = async (data: RolFormValues): Promise<Rol> => {
  const res = await axiosInstance.post('/roles', data);
  return res.data;
};

export const updateRol = async (
  id: number,
  data: RolFormValues
): Promise<Rol> => {
  const res = await axiosInstance.put(`/roles/${id}`, data);
  return res.data;
};

export const deleteRol = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/roles/${id}`);
};