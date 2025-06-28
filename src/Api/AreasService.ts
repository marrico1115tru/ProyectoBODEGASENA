import axios from 'axios';

const API_URL = 'http://localhost:3000/areas';

// Config global (asegúrate de usar esto si tienes más archivos)
const config = {
  withCredentials: true, // ⚠️ Importante para enviar cookies al backend
};

export const getAreas = async () => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createArea = async (data: any) => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateArea = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteArea = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`, config);
  return res.data;
};
