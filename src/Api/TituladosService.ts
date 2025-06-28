import axios from "axios";
import { Titulado } from "@/types/types/typesTitulados";

const API_URL = "http://localhost:3000/titulados";

// Configuración global para permitir envío de cookies/sesión
const config = {
  withCredentials: true,
};

export const getTitulados = async (): Promise<Titulado[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createTitulado = async (
  data: Partial<Titulado>
): Promise<Titulado> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateTitulado = async (
  id: number,
  data: Partial<Titulado>
): Promise<Titulado> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteTitulado = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
