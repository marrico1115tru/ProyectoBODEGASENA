import { useEffect, useState } from "react";
import { getBodegas, Bodega } from "@/Api/Bodegas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BodegaStats = () => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBodegas()
      .then(setBodegas)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!bodegas.length) return <div>Cargando estadísticas...</div>;

  const total = bodegas.length;
  const sinUbicacion = bodegas.filter((b) => !b.ubicacion).length;

  const groupedByYear = bodegas.reduce((acc: Record<string, number>, bodega) => {
    const year = new Date(bodega.fecha_registro).getFullYear().toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(groupedByYear).map(([year, count]) => ({
    year,
    count,
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reporte de Bodegas</h2>

      <div className="mb-6 space-y-2">
        <p><strong>Total de Bodegas:</strong> {total}</p>
        <p><strong>Bodegas sin ubicación:</strong> {sinUbicacion}</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BodegaStats;
