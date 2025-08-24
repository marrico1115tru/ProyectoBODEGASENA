import axiosInstance from "./../Api/axios"; 
import { DetalleSolicitud } from "@/types/types/detalles_solicitud"; 
export const getDetalleSolicitudes = async (): Promise<DetalleSolicitud[]> => {
  const res = await axiosInstance.get("/detalle-solicitud");
  return res.data;
};

export const createDetalleSolicitud = async (
  data: Partial<DetalleSolicitud>
): Promise<DetalleSolicitud> => {
  const res = await axiosInstance.post("/detalle-solicitud", data);
  return res.data;
};

export const updateDetalleSolicitud = async (
  id: number,
  data: Partial<DetalleSolicitud>
): Promise<DetalleSolicitud> => {
  const res = await axiosInstance.put(`/detalle-solicitud/${id}`, data);
  return res.data;
};

export const deleteDetalleSolicitud = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/detalle-solicitud/${id}`);
};