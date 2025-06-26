// src/Api/permisosRoles.ts
import axios from 'axios';

const API = 'http://localhost:3000/permisos';

// ✅ Obtener permisos por ID de rol con fetch (opcional)
export const getPermisosPorRol = async (idRol: number) => {
  const response = await fetch(`${API}/rol/${idRol}`);
  if (!response.ok) {
    throw new Error('Error al obtener permisos por rol');
  }
  return await response.json();
};

// ✅ Obtener permisos por ruta e ID de rol
export const getPermisosPorRuta = async (idRol: number, ruta: string) => {
  try {
    const res = await axios.get(
      `${API}/por-ruta?ruta=${encodeURIComponent(ruta)}&idRol=${idRol}`,
      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    console.error('Error al obtener permisos por ruta:', error);
    return {
      puedeVer: false,
      puedeCrear: false,
      puedeEditar: false,
      puedeEliminar: false,
    };
  }
};

// ✅ Alternativa con Axios (no necesaria si usas la anterior)
export async function obtenerPermisosPorRol(idRol: number) {
  const res = await axios.get(`${API}/rol/${idRol}`, {
    withCredentials: true,
  });
  return res.data.data;
}

// ✅ Actualizar permiso
export async function actualizarPermiso(
  idPermiso: number,
  data: Partial<{
    puedeVer: boolean;
    puedeCrear: boolean;
    puedeEditar: boolean;
    puedeEliminar: boolean;
  }>
) {
  const res = await axios.put(`${API}/${idPermiso}`, data, {
    withCredentials: true,
  });
  return res.data;
}
