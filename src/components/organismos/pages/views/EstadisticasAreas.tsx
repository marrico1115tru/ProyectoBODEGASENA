// src/views/EstadisticasAreas.jsx
import React from "react";
import AreasChart from "@/components/organismos/pages/estadisticas/areas";

const EstadisticasAreas = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Estadísticas de Áreas</h1>
      <AreasChart />
    </div>
  );
};

export default EstadisticasAreas;
