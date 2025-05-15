// src/api/AreasService.ts
import axios from 'axios';
import { Area } from '@/types/types/typesArea';

const API_URL = 'http://localhost:3500/api/areas';

export const getAreas = async (): Promise<Area[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createArea = async (area: Area): Promise<Area> => {
  const response = await axios.post(API_URL, area);
  return response.data;
};

export const updateArea = async (id: number, area: Area): Promise<Area> => {
  const response = await axios.put(`${API_URL}/${id}`, area);
  return response.data;
};

export const deleteArea = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
