// src/Api/SedesService.ts
import axios from "axios";
import { Sede } from "@/types/types/Sede";

const BASE_URL = "http://localhost:3000/sedes";

export const getSedes = async (): Promise<Sede[]> => {
  const response = await axios.get(BASE_URL);
  const result = response.data;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;

  console.error("Respuesta inesperada en getSedes:", result);
  return [];
};

export const createSede = async (sede: Partial<Sede>): Promise<Sede> => {
  const response = await axios.post(BASE_URL, sede);
  return response.data?.data ?? response.data;
};

export const updateSede = async (id: number, sede: Partial<Sede>): Promise<Sede> => {
  const response = await axios.put(`${BASE_URL}/${id}`, sede);
  return response.data?.data ?? response.data;
};

export const deleteSede = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
