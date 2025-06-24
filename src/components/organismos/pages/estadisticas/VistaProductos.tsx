'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import DefaultLayout from '@/layouts/default';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

interface Producto {
  nombre: string;
  inventarios: { stock: number }[];
}

interface ProductoMovimiento {
  nombre: string;
  totalMovimiento: number | string;
}

export default function VistaProductos() {
  const [vencidos, setVencidos] = useState<Producto[]>([]);
  const [masMovidos, setMasMovidos] = useState<ProductoMovimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vencidosRes, movidosRes] = await Promise.all([
          axios.get('http://localhost:3000/productos/vencidos'),
          axios.get('http://localhost:3000/productos/mayor-movimiento'),
        ]);

        const productosVencidosFiltrados = vencidosRes.data.filter(
          (p: any) => Array.isArray(p.inventarios) && p.inventarios.length > 0
        );

        setVencidos(productosVencidosFiltrados);
        setMasMovidos(movidosRes.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener datos del servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderBarChart = (labels: string[], data: number[], label: string, color: string) => (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: color,
            borderRadius: 6,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: label,
            font: { size: 18 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      }}
    />
  );

  return (
    <DefaultLayout>
      <div className="p-6 space-y-8 bg-slate-900 min-h-screen text-white">
        <h2 className="text-2xl font-bold">Estadísticas de Productos</h2>

        {loading && <div className="text-gray-300">Cargando datos...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Productos Vencidos */}
            <div className="bg-white text-black rounded-2xl shadow p-6 h-[28rem]">
              <h3 className="text-xl font-semibold mb-4">Productos Vencidos</h3>
              {vencidos.length > 0 ? (
                renderBarChart(
                  vencidos.map((p) => p.nombre),
                  vencidos.map((p) =>
                    Array.isArray(p.inventarios)
                      ? p.inventarios.reduce((acc, inv) => acc + inv.stock, 0)
                      : 0
                  ),
                  'Stock Total de Productos Vencidos',
                  'rgba(255, 99, 132, 0.5)'
                )
              ) : (
                <p>No hay productos vencidos con inventario.</p>
              )}
            </div>

            {/* Productos con mayor movimiento */}
            <div className="bg-white text-black rounded-2xl shadow p-6 h-[28rem]">
              <h3 className="text-xl font-semibold mb-4">Productos con mayor movimiento</h3>
              {masMovidos.length > 0 ? (
                renderBarChart(
                  masMovidos.map((p) => p.nombre),
                  masMovidos.map((p) => Number(p.totalMovimiento)), // conversión a número
                  'Cantidad Movida',
                  'rgba(54, 162, 235, 0.5)'
                )
              ) : (
                <p>No hay productos con movimiento registrado.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
