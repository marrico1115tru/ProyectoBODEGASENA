'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart } from './Graficasbases/GraficasBaseProductos'; // Ajusta la ruta si es necesario
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';

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

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const config = { withCredentials: true };

        const [resSolicitados, resMovimientos] = await Promise.all([
          axios.get<ProductoSolicitado[]>('http://localhost:3000/productos/solicitados-por-usuario', config),
          axios.get<ProductoMovimiento[]>('http://localhost:3000/productos/mayor-movimiento', config),
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
  }, []);

  // --- Procesamiento de datos para productos solicitados ---
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

  // --- Procesamiento de datos para productos con mayor movimiento ---
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

  // --- Configuración para las gráficas ---
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
            {/* Productos solicitados */}
            <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2 text-center">Productos más solicitados</h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Cantidad de productos solicitados por los usuarios
              </p>
              <div className="max-w-2xl mx-auto h-96">
                <BarChart data={dataBarSolicitados} />
              </div>
            </Card>

            {/* Productos con mayor movimiento */}
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
