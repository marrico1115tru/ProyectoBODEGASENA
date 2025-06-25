import axios from "axios";
import { Usuario } from "@/types/types/Usuario";

const API_URL = "http://localhost:3000/usuarios";

// ✅ Obtener token de autorización
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await axios.get(API_URL, getAuthHeader());
  return res.data;
};

// ✅ Crear usuario
export const createUsuario = async (
  data: Partial<Usuario>
): Promise<Usuario> => {
  const res = await axios.post(API_URL, data, getAuthHeader());
  return res.data;
};

// ✅ Actualizar usuario
export const updateUsuario = async (
  id: number,
  data: Partial<Usuario>
): Promise<Usuario> => {
  const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
  return res.data;
};

// ✅ Eliminar usuario
export const deleteUsuario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeader());
};
