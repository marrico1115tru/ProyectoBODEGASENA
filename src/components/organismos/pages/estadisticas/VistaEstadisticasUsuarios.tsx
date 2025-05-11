// src/pages/VistaEstadisticasUsuarios.tsx
import React, { useEffect, useState } from 'react';
import { BarChart, PieChart } from '../estadisticas/Graficasbases/GraficasBaseUsuarios';
import axios from 'axios';
import { Card } from '@/components/ui/card'; // Asegúrate que esta ruta sea correcta

const VistaEstadisticasUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []);

  // Usuarios por Rol y Sede
  const usuariosPorRolYSede = usuarios.reduce((acc: Record<string, number>, usuario) => {
    const clave = `${usuario.cargo} - ${usuario.area?.nombre || 'Sin Área'}`;
    acc[clave] = (acc[clave] || 0) + 1;
    return acc;
  }, {});

  const dataBarrasRolYSede = {
    labels: Object.keys(usuariosPorRolYSede),
    datasets: [
      {
        label: 'Usuarios por Rol y Sede',
        data: Object.values(usuariosPorRolYSede),
        backgroundColor: '#4F46E5',
      },
    ],
  };

  // Usuarios por Ficha de Formación
  const usuariosPorFicha = usuarios.reduce((acc: Record<string, number>, usuario) => {
    const clave = usuario.ficha?.nombre || 'Sin Ficha';
    acc[clave] = (acc[clave] || 0) + 1;
    return acc;
  }, {});

  const dataBarrasFicha = {
    labels: Object.keys(usuariosPorFicha),
    datasets: [
      {
        label: 'Usuarios por Ficha de Formación',
        data: Object.values(usuariosPorFicha),
        backgroundColor: '#22C55E',
      },
    ],
  };

  // Formación Activa vs Inactiva
  const formacionActivaInactiva = {
    labels: ['Activa', 'Inactiva'],
    datasets: [
      {
        data: [
          usuarios.filter((u) => new Date(u.fechaFinal) > new Date()).length,
          usuarios.filter((u) => new Date(u.fechaFinal) <= new Date()).length,
        ],
        backgroundColor: ['#4F46E5', '#EF4444'],
      },
    ],
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
      {/* Gráfica de barras de Usuarios por Rol y Sede */}
      <Card>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Usuarios por Rol y Sede</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Visualiza la cantidad total de usuarios agrupados por su rol y sede.
          </p>
          <BarChart data={dataBarrasRolYSede} />
        </div>
      </Card>

      {/* Gráfica de barras de Usuarios por Ficha de Formación */}
      <Card>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Usuarios por Ficha de Formación</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Visualiza la cantidad de usuarios en cada ficha de formación.
          </p>
          <BarChart data={dataBarrasFicha} />
        </div>
      </Card>

      {/* Gráfica de pastel para Formación Activa vs Inactiva */}
      <Card className='md:col-span-2'>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Formación Activa vs Inactiva</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Visualiza el estado actual de las formaciones.
          </p>
          <div className='max-w-md mx-auto'>
            <PieChart data={formacionActivaInactiva} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VistaEstadisticasUsuarios;
