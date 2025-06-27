import axios from "axios";
import { Usuario } from "@/types/types/Usuario";

const API_URL = "http://localhost:3000/usuarios";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createUsuario = async (data: Partial<Usuario>): Promise<Usuario> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateUsuario = async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
  const res = await axios.patch(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
