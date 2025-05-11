// src/components/GraficasSolicitudesEntregas.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

const colores = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const dataSolicitudesPorMes = [
  { mes: "Ene", cantidad: 12 },
  { mes: "Feb", cantidad: 20 },
  { mes: "Mar", cantidad: 18 },
  { mes: "Abr", cantidad: 25 },
];

const dataEstadoSolicitudes = [
  { nombre: "Pendientes", valor: 8 },
  { nombre: "Completadas", valor: 24 },
];

const dataTiempoEntrega = [
  { mes: "Ene", dias: 3 },
  { mes: "Feb", dias: 2 },
  { mes: "Mar", dias: 4 },
  { mes: "Abr", dias: 3 },
];

const dataMaterialesMasSolicitados = [
  { nombre: "Cemento", cantidad: 40 },
  { nombre: "Arena", cantidad: 35 },
  { nombre: "Acero", cantidad: 25 },
  { nombre: "Ladrillo", cantidad: 20 },
];

export default function GraficasSolicitudesEntregas() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Solicitudes por mes */}
      <div className="p-4 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Solicitudes por mes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dataSolicitudesPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cantidad" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Estado solicitudes */}
      <div className="p-4 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Pendientes vs Completadas</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataEstadoSolicitudes}
              dataKey="valor"
              nameKey="nombre"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {dataEstadoSolicitudes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tiempo promedio entrega */}
      <div className="p-4 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Tiempo promedio de entrega (días)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dataTiempoEntrega}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="dias" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Materiales más solicitados */}
      <div className="p-4 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Materiales más solicitados</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dataMaterialesMasSolicitados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
