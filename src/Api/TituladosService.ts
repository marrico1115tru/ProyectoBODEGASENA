import axios from "axios";
import { Titulado } from "@/types/types/typesTitulados";


const API_URL = "http://localhost:3000/titulados";

const safeArray = (raw: unknown): Titulado[] => {
  if (Array.isArray(raw)) return raw as Titulado[];
  if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
    return (raw as any).data as Titulado[];
  }
  return []; // fallback
};


export const getTitulados = async (): Promise<Titulado[]> => {
  const res = await axios.get(API_URL);
  return safeArray(res.data);
};

export const createTitulado = async (
  payload: Omit<Partial<Titulado>, "id">
): Promise<Titulado> => {
  const { data } = await axios.post(API_URL, payload);
  return data;
};

export const updateTitulado = async (
  id: number,
  payload: Partial<Titulado>
): Promise<Titulado> => {
  const { data } = await axios.put(`${API_URL}/${id}`, payload);
  return data;
};

export const deleteTitulado = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
