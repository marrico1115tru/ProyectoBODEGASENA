'use client';

import { useEffect, useState } from 'react';
import { ChartBase } from './Graficasbases/GraficasUsuarios';
import DefaultLayout from '@/layouts/default';
import axios from 'axios';

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

  useEffect(() => {
    // Ya no usamos getCookie, solo withCredentials
    const fetchData = async () => {
      try {
        const [productosRes, rolesRes] = await Promise.all([
          axios.get('http://localhost:3000/productos/solicitados-por-usuario', {
            withCredentials: true,
          }),
          axios.get('http://localhost:3000/usuarios/estadisticas/por-rol', {
            withCredentials: true,
          }),
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
        console.error('❌ Error al cargar estadísticas:', err);
        setError('Error al obtener datos de estadísticas. Verifica tu sesión.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                <ChartBase
                  type="bar"
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
                <ChartBase
                  type="pie"
                  data={{
                    labels: usuariosPorRol.map((r) => r.nombreRol),
                    datasets: [
                      {
                        label: 'Cantidad',
                        data: usuariosPorRol.map((r) => r.cantidad),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                        ],
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
