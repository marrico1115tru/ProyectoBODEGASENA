import axios from "axios";
import { DetalleSolicitud } from "@/types/types/detalles_solicitud";

const API_URL = "http://localhost:3000/detalle-solicitud";

export const getDetalleSolicitudes = async (): Promise<DetalleSolicitud[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createDetalleSolicitud = async (
  data: Partial<DetalleSolicitud>
): Promise<DetalleSolicitud> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateDetalleSolicitud = async (
  id: number,
  data: Partial<DetalleSolicitud>
): Promise<DetalleSolicitud> => {
  const res = await axios.patch(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteDetalleSolicitud = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
