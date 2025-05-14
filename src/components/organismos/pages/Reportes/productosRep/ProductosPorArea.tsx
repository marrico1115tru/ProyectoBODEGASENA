import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/default"; // Asegúrate de que esta ruta sea correcta

export default function ProductosPorArea() {
  const containerRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["productos-por-area"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3500/api/productos/estadisticas/por-area");
      return res.data;
    },
  });

  const exportarPDF = () => {
    if (!containerRef.current) return;

    const opt = {
      margin: 0.3,
      filename: "reporte_productos_por_area.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(containerRef.current).save();
  };

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-500">Error al cargar datos.</p>;
  if (!Array.isArray(data)) return <p className="p-6">No se encontraron datos.</p>;

  return (
    <DefaultLayout>
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-800">Productos por Área</h1>
          <Button onClick={exportarPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
            Exportar PDF
          </Button>
        </div>

        <div ref={containerRef} className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-blue-700">NATURVIDA</h2>
            <p className="text-sm text-gray-600">
              Reporte generado automáticamente — {new Date().toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-700">
              Este informe presenta la cantidad total de productos agrupados por cada área funcional
              de la organización.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, i) => (
              <div
                key={i}
                className="p-5 border border-blue-300 rounded-lg bg-blue-50 shadow-md transition transform hover:scale-105 hover:shadow-xl"
              >
                <h2 className="text-lg font-semibold text-blue-800">
                  {item?.area || "Área sin nombre"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Cantidad total:{" "}
                  <span className="font-medium text-blue-900">{item?.cantidad ?? 0}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
