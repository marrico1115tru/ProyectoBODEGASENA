import axiosInstance from './../axios'; 
import { Modulo, Permiso, Rol } from '@/types/types/permiso'; 


export const getModulosConOpciones = async () => {

  const res = await axiosInstance.get<Modulo[]>('/modulos');
  return res.data;
};

export const getRoles = async () => {
  const res = await axiosInstance.get<Rol[]>('/roles');
  return res.data;
};

export const getPermisosPorRol = async (idRol: number) => {
  const res = await axiosInstance.get<Permiso[]>(`/permisos/por-rol?idRol=${idRol}`);
  return res.data;
};

export const actualizarPermisos = async (idRol: number, permisos: Permiso[]) => {
  const res = await axiosInstance.put('/permisos/actualizar', {
    idRol,
    permisos,
  });
  return res.data;
};

export const getPermisosPorRuta = async (ruta: string, idRol: number) => {
  const res = await axiosInstance.get(`/permisos/por-ruta?ruta=${ruta}&idRol=${idRol}`);
  return res.data.data;
};