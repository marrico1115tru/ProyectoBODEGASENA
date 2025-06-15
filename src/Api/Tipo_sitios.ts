// Api/tipoSitioTable.ts
import axios from 'axios';
import { TipoSitio, TipoSitioFormValues } from '@/types/types/tipo_sitios';

const API_URL = 'http://localhost:3000/tipo-sitio';

export const getTiposSitio = async (): Promise<TipoSitio[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTipoSitio = async (data: TipoSitioFormValues) => {
  await axios.post(API_URL, data);
};

export const updateTipoSitio = async (id: number, data: TipoSitioFormValues) => {
  await axios.put(`${API_URL}/${id}`, data);
};

export const deleteTipoSitio = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
