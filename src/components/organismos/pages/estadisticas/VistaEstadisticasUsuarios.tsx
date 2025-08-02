'use client';

import { useEffect, useState } from 'react';
import { BarChart } from './Graficasbases/GraficasBaseProductos';
import axios from 'axios';
import DefaultLayout from '@/layouts/default';
import { getDecodedTokenFromCookies } from '@/lib/utils';

interface ProductosPorUsuario {
  nombreCompleto: string;
  totalSolicitado: number;
}

interface UsuariosPorRol {
  nombreRol: string;
  cantidad: number;
}

export default function VistaEstadisticasUsuarios() {
  const [productosPorUsuario, setProductosPorUsuario] = useState<ProductosPorUsuario[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<UsuariosPorRol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado de permisos para controlar acceso
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/VistaEstadisticasUsuarios&idRol=${rolId}`;
        // Cambia la ruta si tu backend usa otra para este reporte

        const response = await axios.get(url, { withCredentials: true });
        const permisosData = response.data.data;

        if (permisosData) {
          setPermisos({
            puedeVer: Boolean(permisosData.puedeVer),
            puedeCrear: Boolean(permisosData.puedeCrear),
            puedeEditar: Boolean(permisosData.puedeEditar),
            puedeEliminar: Boolean(permisosData.puedeEliminar),
          });
        } else {
          setPermisos({
            puedeVer: false,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false,
          });
        }
      } catch (err) {
        console.error('Error al obtener permisos:', err);
        setPermisos({
          puedeVer: false,
          puedeCrear: false,
          puedeEditar: false,
          puedeEliminar: false,
        });
      }
    };

    fetchPermisos();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!permisos.puedeVer) return;

      setLoading(true);
      setError(null);

      try {
        const config = { withCredentials: true };
        const urlProductos = 'http://localhost:3000/productos/solicitados-por-usuario';
        const urlRoles = 'http://localhost:3000/usuarios/estadisticas/por-rol';

        const [productosRes, rolesRes] = await Promise.all([
          axios.get(urlProductos, config),
          axios.get(urlRoles, config),
        ]);

        const productosValidos = productosRes.data
          .filter(
            (p: any) =>
              p.nombreCompleto && p.nombreCompleto.trim() !== '' && p.totalSolicitado !== null
          )
          .map((p: any) => ({
            nombreCompleto: p.nombreCompleto,
            totalSolicitado: Number(p.totalSolicitado),
          }));

        const rolesValidos = rolesRes.data
          .filter((r: any) => r.nombreRol && r.cantidad !== null)
          .map((r: any) => ({
            nombreRol: r.nombreRol,
            cantidad: Number(r.cantidad),
          }));

        setProductosPorUsuario(productosValidos);
        setUsuariosPorRol(rolesValidos);
      } catch (err) {
        setError('Error al obtener datos de estadísticas.');
        console.error('❌', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [permisos.puedeVer]);

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center font-semibold text-red-600">
          No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6 space-y-8 bg-slate-900 min-h-screen text-white">
        <h2 className="text-2xl font-bold text-center">Estadísticas de Usuarios</h2>

        {loading && <div className="text-gray-300">Cargando datos...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Productos solicitados por usuario */}
            <div className="bg-white text-black rounded-2xl shadow p-6 h-[28rem]">
              <h3 className="text-xl font-semibold mb-4">Solicitudes por usuario</h3>
              {productosPorUsuario.length > 0 ? (
                <BarChart
                  data={{
                    labels: productosPorUsuario.map((u) => u.nombreCompleto),
                    datasets: [
                      {
                        label: 'Total Solicitado',
                        data: productosPorUsuario.map((u) => u.totalSolicitado),
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                      },
                    ],
                    title: 'Solicitudes por Usuario',
                  }}
                />
              ) : (
                <p>No hay solicitudes registradas por usuario.</p>
              )}
            </div>

            {/* Usuarios por rol */}
            <div className="bg-white text-black rounded-2xl shadow p-6 h-[28rem]">
              <h3 className="text-xl font-semibold mb-4">Distribución de usuarios por rol</h3>
              {usuariosPorRol.length > 0 ? (
                <BarChart
                  data={{
                    labels: usuariosPorRol.map((r) => r.nombreRol),
                    datasets: [
                      {
                        label: 'Cantidad de Usuarios',
                        data: usuariosPorRol.map((r) => r.cantidad),
                        backgroundColor: 'rgba(34, 197, 94, 0.6)',
                      },
                    ],
                    title: 'Usuarios por Rol',
                  }}
                />
              ) : (
                <p>No hay datos disponibles de usuarios por rol.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
