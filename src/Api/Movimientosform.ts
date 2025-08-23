import axios from "axios";
import { Movimiento } from "@/types/types/movimientos";

const API_URL = "http://localhost:3000/movimientos";
const config = {
  withCredentials: true,
};

export const getMovimientos = async (): Promise<Movimiento[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createMovimiento = async (
  data: Movimiento
): Promise<Movimiento> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateMovimiento = async (
  id: number,
  data: Movimiento
): Promise<Movimiento> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteMovimiento = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
