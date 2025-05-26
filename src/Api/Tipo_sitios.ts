import axios from "axios";
import { TipoSitio } from "@/types/types/tipo_sitios";

const API_URL = "http://localhost:3000/tipo-sitio"; 

export const getTiposSitio = async (): Promise<TipoSitio[]> => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

export const createTipoSitio = async (tipo: Partial<TipoSitio>): Promise<TipoSitio> => {
  const res = await axios.post(API_URL, tipo);
  return res.data;
};

export const updateTipoSitio = async (
  id: number,
  tipo: Partial<TipoSitio>
): Promise<TipoSitio> => {
  const res = await axios.patch(`${API_URL}/${id}`, tipo);
  return res.data;
};

export const deleteTipoSitio = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
