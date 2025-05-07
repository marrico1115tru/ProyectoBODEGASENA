// src/components/organisms/Report.tsx
import React from "react";
import { Table } from "../molecula/Table"; // Tabla
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"; // Gráfico
import { Card } from "../molecula/Card"; // Tarjeta reutilizable
import { Button } from "@heroui/button";

interface ReportProps {
  title: string;
  data: any[];
  columns: any[];
  chartData: any[];
  chartKeys: string[];
}

const Report = ({ title, data, columns, chartData, chartKeys }: ReportProps) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Título */}
      <h2 className="text-2xl font-semibold">{title}</h2>

      {/* Tabla de Datos */}
      <div className="mt-4">
        <Table data={data} columns={columns} />
      </div>

      {/* Gráfico */}
      <div className="mt-4">
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          {chartKeys.map((key, idx) => (
            <Bar key={idx} dataKey={key} fill="#8884d8" />
          ))}
        </BarChart>
      </div>

      {/* Card Adicional */}
      <div className="mt-6">
        <Card title="Reporte Adicional" content="Detalles adicionales sobre los productos." />
      </div>

      {/* Botón para exportar */}
      <div className="mt-6">
        <Button className="bg-blue-500 text-white p-2 rounded">Exportar Reporte</Button>
      </div>
    </div>
  );
};

export default Report;
