import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart } from '../estadisticas/Graficasbases/GraficasBaseSitios';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';

const VistaEstadisticasSitios: React.FC = () => {
  const [sitios, setSitios] = useState<any[]>([]);

  useEffect(() => {
    const fetchSitios = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/sitios');
        setSitios(response.data);
      } catch (error) {
        console.error('Error al obtener sitios:', error);
      }
    };

    fetchSitios();
  }, []);

  const sitiosActivos = sitios.filter((sitio) => sitio.activo).length;
  const sitiosInactivos = sitios.filter((sitio) => !sitio.activo).length;

  const dataPieSitiosActivos = {
    labels: ['Activos', 'Inactivos'],
    datasets: [
      {
        data: [sitiosActivos, sitiosInactivos],
        backgroundColor: ['#22C55E', '#EF4444'],
      },
    ],
  };

  return (
    <DefaultLayout>
      <div className="p-6 bg-[#0f172a] min-h-screen">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Estadísticas de Sitios</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-2 text-center">Sitios Activos vs Inactivos</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Gráfica que muestra la cantidad de sitios activos e inactivos registrados.
            </p>
            <div className="max-w-md mx-auto">
              <PieChart data={dataPieSitiosActivos} />
            </div>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VistaEstadisticasSitios;
