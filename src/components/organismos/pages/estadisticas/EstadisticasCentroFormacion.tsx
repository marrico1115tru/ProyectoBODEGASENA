"use client";
import { useEffect, useState } from "react";
import { getCentroFormacionStatistics } from "@/Api/EstadisticascentrosFormacion"; // Tu función fetch
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

export default function CentroFormacionEstadisticas() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    try {
      const res = await getCentroFormacionStatistics(startDate, endDate);
      setData(res);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    setStartDate(format(weekAgo, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Estadísticas por Centro de Formación</h1>

      <div className="flex gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Total de Áreas por Centro</h2>
        {data.length === 0 ? (
          <p className="text-gray-500">No hay datos disponibles para este rango de fechas.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAreas" fill="#6366f1" name="Áreas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Total de Municipios por Centro</h2>
        {data.length === 0 ? (
          <p className="text-gray-500">No hay datos disponibles para este rango de fechas.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalMunicipios" fill="#10b981" name="Municipios" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
