import axiosInstance from './../Api/axios'; 
import { Municipio } from '@/types/types/typesMunicipio'; 


export const obtenerMunicipios = async (): Promise<Municipio[]> => {
  const res = await axiosInstance.get('/municipios');
  return res.data;
};

export const crearMunicipio = async (
  municipio: Omit<Municipio, 'id'>
): Promise<Municipio> => {
  const res = await axiosInstance.post('/municipios', municipio);
  return res.data;
};

export const actualizarMunicipio = async (
  id: number,
  municipio: Omit<Municipio, 'id'>
): Promise<Municipio> => {
  const res = await axiosInstance.put(`/municipios/${id}`, municipio);
  return res.data;
};

export const eliminarMunicipio = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/municipios/${id}`);
};