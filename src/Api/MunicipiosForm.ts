// src/api/municipioApi.ts
import axios from "axios";
import { Municipio } from "@/types/types/typesMunicipio";

const API_URL = "http://localhost:3500/api/municipios";

export const getMunicipios = async (): Promise<Municipio[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createMunicipio = async (municipio: Omit<Municipio, "id">): Promise<Municipio> => {
  const response = await axios.post(API_URL, municipio);
  return response.data;
};

export const updateMunicipio = async (id: number, municipio: Omit<Municipio, "id">): Promise<Municipio> => {
  const response = await axios.put(`${API_URL}/${id}`, municipio);
  return response.data;
};

export const deleteMunicipio = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
