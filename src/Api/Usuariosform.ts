import axiosInstance from "./../Api/axios"; 
import { Usuario, UsuarioFormValues } from "@/types/types/Usuario";


export const getUsuarios = async (): Promise<Usuario[]> => {

  const res = await axiosInstance.get("/usuarios");
  return res.data;
};

export const createUsuario = async (
  data: UsuarioFormValues
): Promise<Usuario> => {
  const res = await axiosInstance.post("/usuarios", data);
  return res.data;
};


export const updateUsuario = async (
  id: number,
  data: UsuarioFormValues
): Promise<Usuario> => {
  const res = await axiosInstance.put(`/usuarios/${id}`, data);
  return res.data;
};


export const deleteUsuario = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/usuarios/${id}`);
};