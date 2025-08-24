import axiosInstance from "./../Api/axios"; 
import { Titulado } from "@/types/types/typesTitulados";


export const getTitulados = async (): Promise<Titulado[]> => {
  
  const res = await axiosInstance.get("/titulados");
  return res.data;
};


export const createTitulado = async (
  data: Partial<Titulado>
): Promise<Titulado> => {
  const res = await axiosInstance.post("/titulados", data);
  return res.data;
};


export const updateTitulado = async (
  id: number,
  data: Partial<Titulado>
): Promise<Titulado> => {
  const res = await axiosInstance.put(`/titulados/${id}`, data);
  return res.data;
};


export const deleteTitulado = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/titulados/${id}`);
};