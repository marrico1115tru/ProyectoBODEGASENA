import axios from 'axios';
import { Modulo, Permiso, Rol } from '@/types/types/permiso';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Cambia si tu backend usa otro puerto
  withCredentials: true, // ⬅️ IMPORTANTE para cookies
});

// Obtener módulos con sus opciones
export const getModulosConOpciones = async () => {
  const res = await api.get<Modulo[]>('/modulos');
  return res.data;
};

// Obtener todos los roles
export const getRoles = async () => {
  const res = await api.get<Rol[]>('/roles');
  return res.data;
};

// Obtener permisos por rol
export const getPermisosPorRol = async (idRol: number) => {
  const res = await api.get<Permiso[]>(`/permisos/por-rol?idRol=${idRol}`);
  return res.data;
};

// Actualizar permisos para un rol
export const actualizarPermisos = async (idRol: number, permisos: Permiso[]) => {
  const res = await api.put('/permisos/actualizar', {
    idRol,
    permisos,
  });
  return res.data;
};
export const getPermisosPorRuta = async (ruta: string, idRol: number) => {
  const res = await api.get(`/permisos/por-ruta?ruta=${ruta}&idRol=${idRol}`);
  return res.data.data; // ⬅️ Solo la parte útil
};
