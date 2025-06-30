import axios from "axios";
import { Usuario, UsuarioFormValues } from "@/types/types/Usuario";

const API_URL = "http://localhost:3000/usuarios";

// Configuración para incluir cookies HTTPOnly
const config = {
  withCredentials: true,
};

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

// Crear un nuevo usuario
export const createUsuario = async (
  data: UsuarioFormValues
): Promise<Usuario> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

// Actualizar un usuario
export const updateUsuario = async (
  id: number,
  data: UsuarioFormValues
): Promise<Usuario> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

// Eliminar un usuario
export const deleteUsuario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
