import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, PieChart } from './Graficasbases/GraficasBaseSitios';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';

interface SitioEstadistica {
  estado: string;
  cantidad: number;
}

const VistaEstadisticasSitios: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<SitioEstadistica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const config = {
          withCredentials: true, // 🔐 Enviar cookies al backend
        };

        const url = 'http://localhost:3000/sitio/estadisticas/por-estado';
        const response = await axios.get<SitioEstadistica[]>(url, config);

        setEstadisticas(response.data);
      } catch (err) {
        setError('Error al obtener estadísticas de sitios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  const labels = estadisticas.map((e) => e.estado);
  const values = estadisticas.map((e) => e.cantidad);
  const colores = labels.map((estado) =>
    estado === 'ACTIVO' ? '#4ADE80' : '#F87171'
  );

  const total = values.reduce((acc, val) => acc + val, 0);
  const porcentajes = values.map((valor) =>
    total > 0 ? Number(((valor / total) * 100).toFixed(2)) : 0
  );

  const dataBarSitios = {
    labels,
    datasets: [
      {
        label: 'Cantidad de Sitios',
        data: values,
        backgroundColor: colores,
      },
    ],
  };

  const dataPieSitios = {
    labels: labels.map((label, index) => `${label} (${porcentajes[index]}%)`),
    datasets: [
      {
        data: values,
        backgroundColor: colores,
      },
    ],
  };

  return (
    <DefaultLayout>
      <div className="p-6 bg-[#0f172a] min-h-screen">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Estadísticas de Sitios</h1>

        {loading && <p className="text-white text-center">Cargando estadísticas...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2 text-center">Sitios Activos vs Inactivos</h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Comparación de sitios activos e inactivos
              </p>
              <div className="max-w-2xl mx-auto">
                <BarChart data={dataBarSitios} />
              </div>
            </Card>

            <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2 text-center">Distribución de Sitios (%)</h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Porcentaje de sitios activos e inactivos
              </p>
              <div className="max-w-md mx-auto">
                <PieChart data={dataPieSitios} />
              </div>
            </Card>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default VistaEstadisticasSitios;
