import axiosInstance from './../Api/axios'; 
import {
  TipoSitio,
  TipoSitioFormValues,
} from '@/types/types/tipo_sitios';


export const getTiposSitio = async (): Promise<TipoSitio[]> => {

  const res = await axiosInstance.get('/tipo-sitio');
  return res.data;
};


export const createTipoSitio = async (
  data: TipoSitioFormValues
): Promise<TipoSitio> => {
  const res = await axiosInstance.post('/tipo-sitio', data);
  return res.data;
};

export const updateTipoSitio = async (
  id: number,
  data: TipoSitioFormValues
): Promise<TipoSitio> => {
  const res = await axiosInstance.put(`/tipo-sitio/${id}`, data);
  return res.data;
};


export const deleteTipoSitio = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tipo-sitio/${id}`);
};