import axios from "axios";
import { DetalleSolicitud } from "@/types/types/detalles_solicitud";

const API_URL = "http://localhost:3000/detalle-solicitud";

// Config global para enviar cookies/sesiones al backend
const config = {
  withCredentials: true,
};

export const getDetalleSolicitudes = async (): Promise<DetalleSolicitud[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createDetalleSolicitud = async (
  data: Partial<DetalleSolicitud>
): Promise<DetalleSolicitud> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateDetalleSolicitud = async (
  id: number,
  data: Partial<DetalleSolicitud>
): Promise<DetalleSolicitud> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteDetalleSolicitud = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
