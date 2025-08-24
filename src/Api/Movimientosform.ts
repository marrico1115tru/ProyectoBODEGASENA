import axiosInstance from "./../Api/axios"; 
import { Movimiento } from "@/types/types/movimientos"; 


export const getMovimientos = async (): Promise<Movimiento[]> => {
  const res = await axiosInstance.get("/movimientos");
  return res.data;
};

export const createMovimiento = async (
  data: Movimiento
): Promise<Movimiento> => {
  const res = await axiosInstance.post("/movimientos", data);
  return res.data;
};

export const updateMovimiento = async (
  id: number,
  data: Movimiento
): Promise<Movimiento> => {
  const res = await axiosInstance.put(`/movimientos/${id}`, data);
  return res.data;
};

export const deleteMovimiento = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/movimientos/${id}`);
};