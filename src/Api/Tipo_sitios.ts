// Api/tipoSitioTable.ts
import axios from 'axios';
import {
  TipoSitio,
  TipoSitioFormValues,
} from '@/types/types/tipo_sitios';

const API_URL = 'http://localhost:3000/tipo-sitio';

// Configuración global para permitir envío de cookies/sesiones
const config = {
  withCredentials: true,
};

export const getTiposSitio = async (): Promise<TipoSitio[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createTipoSitio = async (
  data: TipoSitioFormValues
): Promise<TipoSitio> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateTipoSitio = async (
  id: number,
  data: TipoSitioFormValues
): Promise<TipoSitio> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteTipoSitio = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
