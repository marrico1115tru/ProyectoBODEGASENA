import axios from "axios";
import { FichaFormacion } from "@/types/types/FichaFormacion";

const API_URL = "http://localhost:3000/fichas-formacion";
const config = {
  withCredentials: true,
};

export const getFichasFormacion = async (): Promise<FichaFormacion[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createFichaFormacion = async (
  data: Partial<FichaFormacion>
): Promise<FichaFormacion> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateFichaFormacion = async (
  id: number,
  data: Partial<FichaFormacion>
): Promise<FichaFormacion> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteFichaFormacion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
