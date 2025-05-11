import React, { useEffect, useState } from 'react';
import { BarChart, PieChart } from '../estadisticas/Graficasbases/GraficasBaseSitios';
import axios from 'axios';
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

  // Sitios por Tipo de Sitio
  const sitiosPorTipo = sitios.reduce((acc: Record<string, number>, sitio) => {
    const tipo = sitio.tipoSitio?.nombre || 'Desconocido';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  const dataBarSitiosTipo = {
    labels: Object.keys(sitiosPorTipo),
    datasets: [
      {
        label: 'Cantidad de Sitios por Tipo',
        data: Object.values(sitiosPorTipo),
        backgroundColor: '#10B981',
      },
    ],
  };

  const dataPieSitiosTipo = {
    labels: Object.keys(sitiosPorTipo),
    datasets: [
      {
        data: Object.values(sitiosPorTipo),
        backgroundColor: ['#6366F1', '#EC4899', '#F59E0B', '#84CC16', '#06B6D4'],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-1">Sitios por Tipo</h2>
          <p className="text-sm text-gray-500 mb-4">
            Visualiza cuántos sitios hay por cada tipo (oficina, laboratorio, etc.).
          </p>
          <BarChart data={dataBarSitiosTipo} />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-1">Distribución por Tipo (Pastel)</h2>
          <p className="text-sm text-gray-500 mb-4">
            Distribución proporcional de tipos de sitio.
          </p>
          <PieChart data={dataPieSitiosTipo} />
        </div>
      </Card>
    </div>
  );
};

export default VistaEstadisticasSitios;
