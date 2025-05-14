import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import DefaultLayout from "@/layouts/default";

export default function ProductosPorArea() {
  const tableRef = useRef(null);

  // Obtener los productos próximos a vencer
  const { data, isLoading, error } = useQuery({
    queryKey: ["productos-por-area"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3500/api/productos/estadisticas/proximos-vencer");
      return res.data;
    },
  });

  // Función para exportar la tabla a PDF
  const exportarPDF = () => {
    if (!tableRef.current) return;

    const opt = {
      margin: 0.3,
      filename: "reporte_productos_proximos_vencer.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(tableRef.current).save();
  };

  // Manejo de estado de carga y errores
  if (isLoading) return <p className="p-6">Cargando datos...</p>;
  if (error) return <p className="p-6 text-red-500">Error al cargar los datos.</p>;

  return (
    <DefaultLayout>
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-800">Productos proximos a vencer </h1>
          <Button
            onClick={exportarPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Exportar PDF
          </Button>
        </div>

        <div ref={tableRef} className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto text-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-blue-700">INNOVASOFT</h2>
            <p className="text-sm text-gray-600">
              Reporte generado automáticamente — {new Date().toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-700">
              Este reporte muestra la cantidad total de productos proximos a vencer.
            </p>
          </div>

          <table className="w-full text-sm border border-blue-300">
            <thead className="bg-blue-100 text-blue-900 font-semibold">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2 text-left">Área</th>
                <th className="border px-4 py-2 text-right">Cantidad total</th>
                <th className="border px-4 py-2 text-center">Fecha Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2">{item?.area?.nombre || "Sin nombre"}</td>
                  <td className="border px-4 py-2 text-right">{item?.cantidad ?? 0}</td>
                  <td className="border px-4 py-2 text-center">
                    {item?.fechaVencimiento
                      ? new Date(item?.fechaVencimiento).toLocaleDateString("es-ES")
                      : "Sin fecha"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
