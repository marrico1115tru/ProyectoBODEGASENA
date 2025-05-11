import React, { useEffect, useState } from 'react';
import { BarChart, LineChart, PieChart } from './Graficasbases/GraficasBaseProductos';
import axios from 'axios';
import { Card } from '@/components/ui/card';

const VistaProductos: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [mesSeleccionado, setMesSeleccionado] = useState<number>(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProductos();
  }, []);

  // Productos por categoría
  const productosPorCategoria = productos.reduce((acc: Record<string, number>, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {});

  const dataBarras = {
    labels: Object.keys(productosPorCategoria),
    datasets: [
      {
        label: 'Cantidad de Productos',
        data: Object.values(productosPorCategoria),
        backgroundColor: '#4F46E5',
      },
    ],
  };

  // Productos por vencimiento filtrados
  const productosFiltrados = productos.filter((producto) => {
    if (!producto.fechaVencimiento) return false;
    const fecha = new Date(producto.fechaVencimiento);
    return (
      fecha.getMonth() + 1 === mesSeleccionado &&
      fecha.getFullYear() === anioSeleccionado
    );
  });

  const productosPorDia = productosFiltrados.reduce((acc: Record<string, number>, producto) => {
    const fecha = new Date(producto.fechaVencimiento);
    const dia = fecha.getDate().toString().padStart(2, '0');
    acc[dia] = (acc[dia] || 0) + 1;
    return acc;
  }, {});

  const diasDelMes = Array.from({ length: 30 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const dataLineas = {
    labels: diasDelMes,
    datasets: [
      {
        label: 'Productos por Vencimiento',
        data: diasDelMes.map((dia) => productosPorDia[dia] || 0),
        borderColor: '#22C55E',
        fill: false,
      },
    ],
  };

  // Pastel por categoría
  const dataPastel = {
    labels: Object.keys(productosPorCategoria),
    datasets: [
      {
        label: 'Distribución por Categoría',
        data: Object.values(productosPorCategoria),
        backgroundColor: ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444'],
      },
    ],
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
      {/* Gráfica de barras */}
      <Card>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Productos por Categoría</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Visualiza la cantidad total de productos agrupados por su categoría.
          </p>
          <BarChart data={dataBarras} />
        </div>
      </Card>

      {/* Gráfica de líneas con filtros */}
      <Card>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Productos por Fecha de Vencimiento</h2>
          <p className='text-sm text-gray-500 mb-4'>Filtra por mes y año:</p>
          <div className='flex gap-2 mb-4'>
            <select
              className='border rounded px-2 py-1 text-sm'
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(Number(e.target.value))}
            >
              {[
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
              ].map((mes, index) => (
                <option key={index + 1} value={index + 1}>
                  {mes}
                </option>
              ))}
            </select>
            <select
              className='border rounded px-2 py-1 text-sm'
              value={anioSeleccionado}
              onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
            >
              {[2024, 2025, 2026].map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>
          <LineChart data={dataLineas} />
        </div>
      </Card>

      {/* Gráfica de pastel */}
      <Card className='md:col-span-2'>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-1'>Distribución de Productos por Categoría</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Distribución proporcional de productos según la categoría asignada.
          </p>
          <div className='max-w-md mx-auto'>
            <PieChart data={dataPastel} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VistaProductos;
