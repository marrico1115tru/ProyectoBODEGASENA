'use client';

import { useEffect, useState } from 'react';
import { BarChart } from './Graficasbases/GraficasBaseProductos';
import axios from 'axios';
import DefaultLayout from '@/layouts/default';

interface ProductoVencido {
  nombre: string;
  inventarios: { stock: number }[];
}

interface ProductoMasUsado {
  nombre: string;
  totalSolicitado: string; // viene como string desde el backend
}

export default function VistaProductos() {
  const [vencidos, setVencidos] = useState<ProductoVencido[]>([]);
  const [masUsados, setMasUsados] = useState<ProductoMasUsado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/productos/vencidos'),
      axios.get('http://localhost:3000/productos/mas-solicitados'), 
    ])
      .then(([vencidosRes, masUsadosRes]) => {
        setVencidos(vencidosRes.data);
        setMasUsados(masUsadosRes.data);
      })
      .catch((err) => {
        setError('Error al obtener los datos de las estadísticas.');
        console.error('Error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
                <BarChart
                  data={{
                    labels: vencidos.map((p) => p.nombre),
                    datasets: [
                      {
                        label: 'Stock Total',
                        data: vencidos.map((p) =>
                          p.inventarios?.reduce((acc, inv) => acc + inv.stock, 0),
                        ),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      },
                    ],
                    title: 'Productos Vencidos',
                  }}
                />
              ) : (
                <p>No hay productos vencidos.</p>
              )}
            </div>

            {/* Productos Más Usados */}
            <div className="bg-white text-black rounded-2xl shadow p-6 h-[28rem]">
              <h3 className="text-xl font-semibold mb-4">Productos más utilizados</h3>
              {masUsados.length > 0 ? (
                <BarChart
                  data={{
                    labels: masUsados.map((p) => p.nombre),
                    datasets: [
                      {
                        label: 'Cantidad Solicitada',
                        data: masUsados.map((p) => parseInt(p.totalSolicitado)),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                      },
                    ],
                    title: 'Productos más utilizados',
                  }}
                />
              ) : (
                <p>No hay productos más utilizados.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
