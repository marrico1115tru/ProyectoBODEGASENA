'use client';

import React, { useEffect, useState } from 'react';
import { BarChart } from './Graficasbases/GraficasBaseProductos';
import axiosInstance from '@/Api/axios'; 
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';
import { getDecodedTokenFromCookies } from '@/lib/utils';

interface ProductoSolicitado {
  idUsuario: number | null;
  nombreCompleto: string;
  totalSolicitado: string | null;
}

interface ProductoMovimiento {
  nombre: string;
  totalMovimiento: string;
}

const VistaEstadisticasProductos: React.FC = () => {
  const [solicitados, setSolicitados] = useState<ProductoSolicitado[]>([]);
  const [movimientos, setMovimientos] = useState<ProductoMovimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const url = `/permisos/por-ruta?ruta=/VistaProductos&idRol=${rolId}`;
        const response = await axiosInstance.get(url, { withCredentials: true });
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
    const fetchEstadisticas = async () => {
      if (!permisos.puedeVer) return;

      setLoading(true);
      setError(null);

      try {
        const urlSolicitados = '/productos/solicitados-por-usuario';
        const urlMovimientos = '/productos/mayor-movimiento';

        const [resSolicitados, resMovimientos] = await Promise.all([
          axiosInstance.get<ProductoSolicitado[]>(urlSolicitados, { withCredentials: true }),
          axiosInstance.get<ProductoMovimiento[]>(urlMovimientos, { withCredentials: true }),
        ]);

        setSolicitados(resSolicitados.data);
        setMovimientos(resMovimientos.data);
      } catch (err) {
        setError('Error al obtener estadísticas de productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
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

  const labelsSolicitados = solicitados
    .filter(
      (p) =>
        p.nombreCompleto &&
        p.nombreCompleto.trim() !== '' &&
        p.totalSolicitado !== null &&
        !isNaN(Number(p.totalSolicitado))
    )
    .map((p) => p.nombreCompleto);

  const valuesSolicitados = solicitados
    .filter(
      (p) =>
        p.nombreCompleto &&
        p.nombreCompleto.trim() !== '' &&
        p.totalSolicitado !== null &&
        !isNaN(Number(p.totalSolicitado))
    )
    .map((p) => Number(p.totalSolicitado));

  const coloresSolicitados = labelsSolicitados.map(() => '#3B82F6');

  const labelsMovimientos = movimientos
    .filter(
      (p) =>
        p.nombre &&
        p.nombre.trim() !== '' &&
        p.totalMovimiento !== null &&
        !isNaN(Number(p.totalMovimiento))
    )
    .map((p) => p.nombre);

  const valuesMovimientos = movimientos
    .filter(
      (p) =>
        p.nombre &&
        p.nombre.trim() !== '' &&
        p.totalMovimiento !== null &&
        !isNaN(Number(p.totalMovimiento))
    )
    .map((p) => Number(p.totalMovimiento));

  const coloresMovimientos = labelsMovimientos.map(() => '#F59E0B');

  const dataBarSolicitados = {
    labels: labelsSolicitados,
    datasets: [
      {
        label: 'Cantidad solicitada',
        data: valuesSolicitados,
        backgroundColor: coloresSolicitados,
      },
    ],
    title: 'Productos más solicitados',
  };

  const dataBarMovimientos = {
    labels: labelsMovimientos,
    datasets: [
      {
        label: 'Movimientos',
        data: valuesMovimientos,
        backgroundColor: coloresMovimientos,
      },
    ],
    title: 'Productos con mayor movimiento',
  };

  return (
    <DefaultLayout>
      <div className="p-6 bg-[#0f172a] min-h-screen">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Estadísticas de Productos</h1>

        {loading && <p className="text-white text-center">Cargando estadísticas...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2 text-center">Productos más solicitados</h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Cantidad de productos solicitados por los usuarios
              </p>
              <div className="max-w-2xl mx-auto h-96">
                <BarChart data={dataBarSolicitados} />
              </div>
            </Card>

            <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2 text-center">Productos con mayor movimiento</h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Ranking de productos por cantidad de movimientos
              </p>
              <div className="max-w-2xl mx-auto h-96">
                <BarChart data={dataBarMovimientos} />
              </div>
            </Card>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default VistaEstadisticasProductos;
