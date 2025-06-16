import axios from "axios";
import { Solicitud } from "@/types/types/Solicitud";

const API_URL = "http://localhost:3000/solicitudes";

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createSolicitud = async (
  data: Partial<Solicitud>
): Promise<Solicitud> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateSolicitud = async (
  id: number,
  data: Partial<Solicitud>
): Promise<Solicitud> => {
  const res = await axios.patch(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteSolicitud = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
