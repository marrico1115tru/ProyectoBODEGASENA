import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, PieChart } from '../estadisticas/Graficasbases/GraficasBaseSitios';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';

const VistaEstadisticasUsuarios: React.FC = () => {
  const [productosPrestados, setProductosPrestados] = useState<any[]>([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState<any[]>([]);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const [responsePrestamos, responseRoles] = await Promise.all([
          axios.get('http://localhost:3500/api/usuarios/productos-prestados'),
          axios.get('http://localhost:3500/api/usuarios/usuarios-por-rol')
        ]);

        setProductosPrestados(responsePrestamos.data);
        setUsuariosPorRol(responseRoles.data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    fetchEstadisticas();
  }, []);

  const dataBarProductos = {
    labels: productosPrestados.map((item) => item.usuario),
    datasets: [
      {
        label: 'Productos Prestados',
        data: productosPrestados.map((item) => item.totalProductosPrestados),
        backgroundColor: '#2563EB',
      },
    ],
  };

  const dataPieUsuarios = {
    labels: usuariosPorRol.map((item) => item.rol),
    datasets: [
      {
        data: usuariosPorRol.map((item) => item.cantidadUsuarios),
        backgroundColor: [
          '#1E40AF',
          '#2563EB',
          '#3B82F6',
          '#60A5FA',
          '#93C5FD',
        ],
      },
    ],
  };

  return (
    <DefaultLayout>
      <div className="p-6 bg-[#0f172a] min-h-screen">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Estadísticas de Usuarios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-2 text-center">Productos Prestados</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Productos prestados por cada usuario
            </p>
            <div className="max-w-2xl mx-auto">
              <BarChart data={dataBarProductos} />
            </div>
          </Card>

          <Card className="bg-white text-gray-900 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-2 text-center">Usuarios por Rol</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Distribución de usuarios por rol
            </p>
            <div className="max-w-md mx-auto">
              <PieChart data={dataPieUsuarios} />
            </div>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VistaEstadisticasUsuarios;
