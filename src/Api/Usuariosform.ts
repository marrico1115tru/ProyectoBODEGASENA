import axios from "axios";
import { Usuario, UsuarioFormValues } from "@/types/types/Usuario";

const API_URL = "http://localhost:3000/usuarios";
const config = {
  withCredentials: true,
};

export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};


export const createUsuario = async (
  data: UsuarioFormValues
): Promise<Usuario> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};


export const updateUsuario = async (
  id: number,
  data: UsuarioFormValues
): Promise<Usuario> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
