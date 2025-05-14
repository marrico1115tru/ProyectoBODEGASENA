import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";

export default function ProductosVencidos() {
  const containerRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["productos-vencidos"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3500/api/productos/estadisticas/vencidos");
      return res.data;
    },
  });

  const exportarPDF = () => {
    if (!containerRef.current) return;

    const options = {
      margin: 0.3,
      filename: "reporte_productos_vencidos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(containerRef.current).save();
  };

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-500">Error al cargar productos vencidos.</p>;
  if (!Array.isArray(data)) return <p className="p-6">No se encontraron datos.</p>;

  return (
    <DefaultLayout>
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-800">Productos Vencidos</h1>
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
              Este reporte detalla los productos que han superado su fecha de vencimiento registrada.
            </p>
          </div>

          <ul className="space-y-4">
            {data.map((prod: any) => (
              <li
                key={prod?.id}
                className="p-5 border border-blue-300 rounded-lg bg-blue-50 shadow-md hover:shadow-xl transition transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-blue-800">
                  {prod?.nombre || "Producto sin nombre"}
                </h3>
                <p className="text-sm text-gray-700">
                  Fecha de vencimiento:{" "}
                  <span className="font-medium text-gray-900">
                    {prod?.fechaVencimiento
                      ? new Date(prod.fechaVencimiento).toLocaleDateString()
                      : "Sin fecha"}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  Cantidad:{" "}
                  <span className="font-medium text-gray-900">
                    {prod?.cantidad ?? 0}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DefaultLayout>
  );
}
