import axios from "axios";
import { Acceso, AccesoInput } from "@/types/types/acceso";

const API_URL = "http://localhost:3500/api/accesos";

export const getAccesos = async (): Promise<Acceso[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createAcceso = async (acceso: AccesoInput): Promise<Acceso> => {
  const res = await axios.post(API_URL, acceso);
  return res.data;
};

export const updateAcceso = async (
  id: number,
  acceso: AccesoInput
): Promise<Acceso> => {
  const res = await axios.put(`${API_URL}/${id}`, acceso);
  return res.data;
};

export const deleteAcceso = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
