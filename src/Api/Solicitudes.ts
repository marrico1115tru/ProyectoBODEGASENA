import axiosInstance from "./../Api/axios"; 
import { Solicitud } from "@/types/types/Solicitud";


export const getSolicitudes = async (): Promise<Solicitud[]> => {
  
  const res = await axiosInstance.get("/solicitudes");
  return res.data;
};


export const createSolicitud = async (
  data: Partial<Solicitud>
): Promise<Solicitud> => {
  const res = await axiosInstance.post("/solicitudes", data);
  return res.data;
};


export const updateSolicitud = async (
  id: number,
  data: Partial<Solicitud>
): Promise<Solicitud> => {
  const res = await axiosInstance.put(`/solicitudes/${id}`, data);
  return res.data;
};


export const deleteSolicitud = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/solicitudes/${id}`);
};