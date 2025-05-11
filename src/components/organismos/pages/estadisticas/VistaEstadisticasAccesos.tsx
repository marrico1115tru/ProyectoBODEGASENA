// src/pages/VistaEstadisticasAccesos.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, PieChart } from '../estadisticas/Graficasbases/GraficasBaseAccesos';
import { Card } from '@/components/ui/card'; // Asegúrate que esta ruta sea correcta

const VistaEstadisticasAccesos: React.FC = () => {
  const [accesos, setAccesos] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccesos = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/accesos');
        setAccesos(response.data);
      } catch (error) {
        console.error('Error al obtener accesos:', error);
      }
    };
    fetchAccesos();
  }, []);

  // Accesos por Rol
  const accesosPorRol = accesos.reduce((acc: Record<string, number>, acceso) => {
    const rol = acceso.rol?.nombre || 'Sin Rol';
    acc[rol] = (acc[rol] || 0) + 1;
    return acc;
  }, {});

  const dataPieAccesosPorRol = {
    labels: Object.keys(accesosPorRol),
    datasets: [
      {
        data: Object.values(accesosPorRol),
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  // Opciones más utilizadas
  const usoOpciones = accesos.reduce((acc: Record<string, number>, acceso) => {
    const opcion = acceso.opcion?.nombre || 'Sin Opción';
    acc[opcion] = (acc[opcion] || 0) + 1;
    return acc;
  }, {});

  const dataBarrasOpciones = {
    labels: Object.keys(usoOpciones),
    datasets: [
      {
        label: 'Uso de Opciones del Sistema',
        data: Object.values(usoOpciones),
        backgroundColor: '#3B82F6',
      },
    ],
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
      {/* Accesos por Rol */}
      <Card>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Accesos por Rol</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Visualiza qué roles acceden más frecuentemente al sistema.
          </p>
          <PieChart data={dataPieAccesosPorRol} />
        </div>
      </Card>

      {/* Opciones más utilizadas */}
      <Card>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Uso de Opciones del Sistema</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Identifica qué opciones del sistema son más utilizadas.
          </p>
          <BarChart data={dataBarrasOpciones} />
        </div>
      </Card>
    </div>
  );
};

export default VistaEstadisticasAccesos;
