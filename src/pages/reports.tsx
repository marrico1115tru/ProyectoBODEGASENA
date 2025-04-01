import React, { useState } from "react";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("ventas");

  const renderReport = () => {
    switch (selectedReport) {
      case "ventas":
        return <p className="text-gray-600">Informe de ventas: Datos de ventas del último mes.</p>;
      case "inventario":
        return <p className="text-gray-600">Informe de inventario: Estado actual del stock.</p>;
      case "clientes":
        return <p className="text-gray-600">Informe de clientes: Análisis de clientes activos.</p>;
      default:
        return <p className="text-gray-600">Seleccione un tipo de reporte.</p>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reportes</h1>
      <select 
        className="mt-4 p-2 border rounded" 
        value={selectedReport} 
        onChange={(e) => setSelectedReport(e.target.value)}
      >
        <option value="ventas">Reporte de Ventas</option>
        <option value="inventario">Reporte de Inventario</option>
        <option value="clientes">Reporte de Clientes</option>
      </select>
      <div className="mt-4">{renderReport()}</div>
    </div>
  );
};

export default Reports;
