import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { motion } from "framer-motion";
import { obtenerEstadisticasAreas } from "@/Api/estadisticasareas";

const COLORS = ["#6366f1", "#10b981", "#f97316", "#e11d48", "#14b8a6", "#8b5cf6"];

const EstadisticasAreas = () => {
  const [data, setData] = useState([]);
  const [filtroCentro, setFiltroCentro] = useState("Todos");

  useEffect(() => {
    const cargarDatos = async () => {
      const datos = await obtenerEstadisticasAreas();
      setData(datos);
    };
    cargarDatos();
  }, []);

  const centrosDisponibles = [...new Set(data.map(d => d.nombreCentro))];

  const dataFiltrada = filtroCentro === "Todos"
    ? data
    : data.filter(d => d.nombreCentro === filtroCentro);

  const totalPorCentro = dataFiltrada.map(d => ({
    nombreCentro: d.nombreCentro,
    totalAreas: d.totalAreas
  }));

  const totalGeneral = totalPorCentro.reduce((acc, curr) => acc + curr.totalAreas, 0);

  const centroMayor = totalPorCentro.reduce((a, b) => (a.totalAreas > b.totalAreas ? a : b), {})?.nombreCentro || 'N/A';

  return (
    <div className="p-8 bg-gray-50 rounded-xl shadow-inner max-w-7xl mx-auto space-y-16">
      <h1 className="text-4xl font-bold text-gray-800 text-center">Estadísticas de Áreas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 justify-center">
        <label className="text-sm font-medium text-gray-700">
          Filtrar por centro:
          <select
            className="ml-2 p-2 rounded border border-gray-300 text-sm"
            value={filtroCentro}
            onChange={e => setFiltroCentro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {centrosDisponibles.map(centro => (
              <option key={centro} value={centro}>{centro}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total de Centros</p>
          <p className="text-2xl font-bold text-indigo-700">{dataFiltrada.length}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total de Áreas</p>
          <p className="text-2xl font-bold text-emerald-700">{totalGeneral}</p>
        </div>
        <div className="bg-fuchsia-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Centro con más áreas</p>
          <p className="text-xl font-semibold text-fuchsia-700">{centroMayor}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Barras */}
        <motion.div className="bg-white p-6 rounded-2xl shadow" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Áreas por Centro</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalPorCentro}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombreCentro" tick={{ fontSize: 11 }} angle={-10} dy={10} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAreas" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pastel */}
        <motion.div className="bg-white p-6 rounded-2xl shadow" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Distribución de Áreas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={totalPorCentro.map(d => ({ name: d.nombreCentro, value: d.totalAreas }))}
                cx="50%" cy="50%" outerRadius={100} dataKey="value" label
              >
                {totalPorCentro.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Línea temporal ficticia */}
      <motion.div className="bg-white p-6 rounded-2xl shadow" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center">Proyección de Áreas (ficticia)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={totalPorCentro.map((d, i) => ({ mes: `Mes ${i + 1}`, cantidad: d.totalAreas }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="cantidad" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default EstadisticasAreas;
