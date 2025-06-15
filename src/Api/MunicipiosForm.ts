import axios from 'axios';
import { Municipio } from '../types/types/typesMunicipio';

const API_URL = 'http://localhost:3000/municipios';

export const obtenerMunicipios = async (): Promise<Municipio[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const crearMunicipio = async (municipio: Omit<Municipio, 'id'>) => {
  const res = await axios.post(API_URL, municipio);
  return res.data;
};

export const actualizarMunicipio = async (id: number, municipio: Omit<Municipio, 'id'>) => {
  const res = await axios.put(`${API_URL}/${id}`, municipio);
  return res.data;
};

export const eliminarMunicipio = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
