// src/Api/PermisosService.ts
import axios from 'axios';

export async function obtenerPermisosPorRuta(ruta: string, idRol: number) {
  const res = await axios.get(`http://localhost:3000/permisos/por-ruta`, {
    params: { ruta, idRol },
    withCredentials: true,
  });
  return res.data.data;
}
