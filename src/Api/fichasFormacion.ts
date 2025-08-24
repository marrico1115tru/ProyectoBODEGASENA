import axiosInstance from "./../Api/axios"; 
import { FichaFormacion } from "@/types/types/FichaFormacion"; 

export const getFichasFormacion = async (): Promise<FichaFormacion[]> => {
  const res = await axiosInstance.get("/fichas-formacion");
  return res.data;
};

export const createFichaFormacion = async (
  data: Partial<FichaFormacion>
): Promise<FichaFormacion> => {
  
  const res = await axiosInstance.post("/fichas-formacion", data);
  return res.data;
};

export const updateFichaFormacion = async (
  id: number,
  data: Partial<FichaFormacion>
): Promise<FichaFormacion> => {
  const res = await axiosInstance.put(`/fichas-formacion/${id}`, data);
  return res.data;
};

export const deleteFichaFormacion = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/fichas-formacion/${id}`);
};