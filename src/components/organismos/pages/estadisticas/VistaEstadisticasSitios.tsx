import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, PieChart } from './Graficasbases/GraficasBaseSitios';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';

const VistaEstadisticasSitios: React.FC = () => {
  const [sitiosActivos, setSitiosActivos] = useState<number>(0);
  const [sitiosInactivos, setSitiosInactivos] = useState<number>(0);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/sitio/activos-inactivos');
        setSitiosActivos(response.data.activos.length);
        setSitiosInactivos(response.data.inactivos.length);
      } catch (error) {
        console.error('Error al obtener estadísticas de sitios:', error);
      }
    };

    fetchEstadisticas();
  }, []);

  const dataBarSitios = {
    labels: ['Activos', 'Inactivos'],
    datasets: [
      {
        label: 'Cantidad de Sitios',
        data: [sitiosActivos, sitiosInactivos],
        backgroundColor: ['#4ADE80', '#F87171'],
      },
    ],
  };

  const dataPieSitios = {
    labels: ['Activos', 'Inactivos'],
    datasets: [
      {
        data: [sitiosActivos, sitiosInactivos],
        backgroundColor: ['#4ADE80', '#F87171'],
      },
    ],
  };

  return (
    <DefaultLayout>
      <div className="p-6 bg-[#0f172a] min-h-screen">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Estadísticas de Sitios</h1>
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
            <h2 className="text-xl font-bold mb-2 text-center">Distribución de Sitios</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Porcentaje de sitios activos e inactivos
            </p>
            <div className="max-w-md mx-auto">
              <PieChart data={dataPieSitios} />
            </div>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VistaEstadisticasSitios;
""