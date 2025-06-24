import axios from "axios";
import { Titulado } from "@/types/types/typesTitulados";

const API_URL = "http://localhost:3000/titulados";

export const getTitulados = async (): Promise<Titulado[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTitulado = async (data: Partial<Titulado>): Promise<Titulado> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateTitulado = async (id: number, data: Partial<Titulado>): Promise<Titulado> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteTitulado = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
