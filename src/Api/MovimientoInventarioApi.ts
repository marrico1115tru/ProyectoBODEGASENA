import axios from 'axios';
import { MovimientoInventario } from '@/types/types/movimientoInventario';

const API_URL = 'http://localhost:3500/api/movimientos';

export const getMovimientos = async (): Promise<MovimientoInventario[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createMovimiento = async (movimiento: MovimientoInventario): Promise<MovimientoInventario> => {
  const response = await axios.post(API_URL, movimiento);
  return response.data;
};

export const updateMovimiento = async (id: number, movimiento: MovimientoInventario): Promise<MovimientoInventario> => {
  const response = await axios.put(`${API_URL}/${id}`, movimiento);
  return response.data;
};

export const deleteMovimiento = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
