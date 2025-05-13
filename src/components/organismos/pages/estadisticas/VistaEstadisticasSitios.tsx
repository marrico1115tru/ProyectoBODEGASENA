
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart } from '../estadisticas/Graficasbases/GraficasBaseUsuarios';
import { Card } from '@/components/ui/card'; 

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
    <div className="p-4">
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Sitios Activos vs Inactivos</h2>
          <p className="text-sm text-gray-500 mb-4">
            Gráfica que muestra la cantidad de sitios activos e inactivos registrados.
          </p>
          <div className="max-w-md mx-auto">
            <PieChart data={dataPieSitiosActivos} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VistaEstadisticasSitios;
