import axios from "axios";
import { Solicitud } from "@/types/types/Solicitud";

const API_URL = "http://localhost:3500/api/solicitudes";


export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createSolicitud = async (solicitud: Omit<Solicitud, "id">): Promise<Solicitud> => {
  const response = await axios.post(API_URL, solicitud);
  return response.data;
};


export const updateSolicitud = async (id: number, solicitud: Omit<Solicitud, "id">): Promise<Solicitud> => {
  const response = await axios.put(`${API_URL}/${id}`, solicitud);
  return response.data;
};


export const deleteSolicitud = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
