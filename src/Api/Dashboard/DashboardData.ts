import { useEffect, useState } from "react";
import axios from "axios";

interface Usuario {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  estado: string;
  id_area: number;
  fecha_creacion: string;
}

interface Area {
  id: number;
  nombre: string;
}

interface DashboardData {
  totalUsuarios: number;
  totalProductos: number;
  totalAreas: number;
  resumen: number;
  usuarios: Usuario[];
  productos: Producto[];
  areas: Area[];
}

// Configuración global para permitir envío de cookies/sesión
const config = {
  withCredentials: true,
};

export const useDashboardData = (p0: { enabled: boolean; }) => {
  const [data, setData] = useState<DashboardData>({
    totalUsuarios: 0,
    totalProductos: 0,
    totalAreas: 0,
    resumen: 0,
    usuarios: [],
    productos: [],
    areas: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usuariosRes, productosRes, areasRes] = await Promise.all([
          axios.get("http://localhost:3000/usuarios", config),
          axios.get("http://localhost:3000/productos", config),
          axios.get("http://localhost:3000/areas", config),
        ]);

        setData({
          totalUsuarios: usuariosRes.data.length,
          totalProductos: productosRes.data.length,
          totalAreas: areasRes.data.length,
          resumen: Math.floor(
            ((usuariosRes.data.length +
              productosRes.data.length +
              areasRes.data.length) /
              500) *
              100
          ),
          usuarios: usuariosRes.data,
          productos: productosRes.data,
          areas: areasRes.data,
        });
      } catch (error) {
        console.error("Error al cargar el dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading };
};
