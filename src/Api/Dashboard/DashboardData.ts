import { useEffect, useState } from "react";
import api from "@/lib/axios"; // Instancia de Axios con cookies

// Interfaces
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

export const useDashboardData = () => {
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
          api.get("/usuarios"),
          api.get("/productos"),
          api.get("/areas"),
        ]);

        const totalUsuarios = usuariosRes.data.length;
        const totalProductos = productosRes.data.length;
        const totalAreas = areasRes.data.length;

        setData({
          totalUsuarios,
          totalProductos,
          totalAreas,
          resumen: Math.floor(((totalUsuarios + totalProductos + totalAreas) / 500) * 100),
          usuarios: usuariosRes.data,
          productos: productosRes.data,
          areas: areasRes.data,
        });
      } catch (error) {
        console.error("❌ Error al cargar el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading };
};
