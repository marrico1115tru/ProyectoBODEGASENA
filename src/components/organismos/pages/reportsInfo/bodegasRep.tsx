import React, { useEffect, useMemo, useState } from 'react';
import { Bodega, fetchBodegas } from "@/Api/Bodegas";

const ReporteBodegas: React.FC = () => {
  const [data, setData] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const bodegas = await fetchBodegas();
        setData(bodegas);
      } catch (error) {
        console.error("Error al obtener las bodegas:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  const datosFiltrados = useMemo(() => {
    return data.filter((item) =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (item.ubicacion ?? "").toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, data]);

  const totalBodegas = data.length;
  const ubicacionesUnicas = useMemo(
    () => [...new Set(data.map((bodega) => bodega.ubicacion).filter(Boolean))].length,
    [data]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Cargando reporte...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reporte de Bodegas</h2>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded-md border border-gray-200">
          <p className="text-gray-500 text-sm">Total de Bodegas</p>
          <p className="text-xl font-semibold text-blue-600">{totalBodegas}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-md border border-gray-200">
          <p className="text-gray-500 text-sm">Ubicaciones únicas</p>
          <p className="text-xl font-semibold text-green-600">{ubicacionesUnicas}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-md border border-gray-200">
          <p className="text-gray-500 text-sm">Último registro</p>
          <p className="text-xl font-semibold text-purple-600">
            {data.length > 0
              ? new Date(
                  Math.max(...data.map((b) => new Date(b.fecha_registro).getTime()))
                ).toLocaleDateString('es-CO')
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* BÚSQUEDA */}
      <input
        type="text"
        placeholder="Buscar por nombre o ubicación..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded w-full"
      />

      {/* TABLA */}
      <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Nombre</th>
            <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Ubicación</th>
            <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {datosFiltrados.map((bodega) => (
            <tr key={bodega.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-t border-gray-200 text-sm text-gray-700">{bodega.nombre}</td>
              <td className="py-2 px-4 border-t border-gray-200 text-sm text-gray-700">{bodega.ubicacion ?? 'N/A'}</td>
              <td className="py-2 px-4 border-t border-gray-200 text-sm text-gray-700">
                {new Date(bodega.fecha_registro).toLocaleString('es-CO')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {datosFiltrados.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default ReporteBodegas;
