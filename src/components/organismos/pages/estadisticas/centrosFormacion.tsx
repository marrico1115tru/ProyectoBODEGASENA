import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CentroFormacion {
  id: number;
  nombre: string;
  ubicacion: string;
  telefono?: string;
  fecha_registro: string;
}

interface Props {
  data: CentroFormacion[];
}

const CentrosFormacion: React.FC<Props> = ({ data }) => {
  const agrupado = data.reduce((acc: Record<string, number>, centro) => {
    acc[centro.ubicacion] = (acc[centro.ubicacion] || 0) + 1;
    return acc;
  }, {});

  const datosAgrupados = Object.entries(agrupado).map(([ubicacion, cantidad]) => ({
    ubicacion,
    cantidad,
  }));

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Centros de Formación por Ubicación</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={datosAgrupados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ubicacion" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CentrosFormacion;
