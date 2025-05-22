import axios from "axios";
import { Municipio } from "@/types/types/typesMunicipio";

const API_URL = "http://localhost:3000/municipios";

export const getMunicipios = async (): Promise<Municipio[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createMunicipio = async (data: Partial<Municipio>) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateMunicipio = async (id: number, data: Partial<Municipio>) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteMunicipio = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
