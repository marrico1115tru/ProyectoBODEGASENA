import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

export default function EstadisticasCentros() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3500/api/estadisticas")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener estadísticas:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-gray-600 text-center py-20 text-xl">
        ⏳ Cargando estadísticas...
      </p>
    );
  if (!data)
    return (
      <p className="text-red-500 text-center py-20 text-xl">
        ❌ Error al cargar datos.
      </p>
    );

  return (
    <div className="w-full h-full p-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Encabezado */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        📊 Estadísticas de Centros de Formación
      </h1>

      {/* Total de centros */}
      <div className="flex justify-center mb-12">
        <Card className="w-full max-w-sm p-8 bg-white shadow-lg rounded-2xl text-center">
          <h2 className="text-xl text-slate-600 font-semibold mb-2">
            Total de Centros Registrados
          </h2>
          <p className="text-6xl font-extrabold text-indigo-600">
            {data.totalCentros}
          </p>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Sedes por centro */}
        <Card className="p-6 bg-white shadow-md rounded-2xl hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">
            Sedes por Centro
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data.sedesPorCentro}
              margin={{ top: 10, right: 10, bottom: 50, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nombre"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={90}
                tick={{ fontSize: 12 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="sedes" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Áreas por centro */}
        <Card className="p-6 bg-white shadow-md rounded-2xl hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">
            Áreas por Centro
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data.areasPorCentro}
              margin={{ top: 10, right: 10, bottom: 50, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nombre"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={90}
                tick={{ fontSize: 12 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="areas" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
