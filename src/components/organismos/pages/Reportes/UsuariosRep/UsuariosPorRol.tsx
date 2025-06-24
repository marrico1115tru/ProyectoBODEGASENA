import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";
import Modal from "@/components/ui/Modal";

interface ActividadRol {
  rol: string;
  solicitudes: Record<string, number>;
  entregas: Record<string, number>;
}

export default function UsuariosPorRolActividad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data, isLoading, error } = useQuery<ActividadRol[]>({
    queryKey: ["usuarios-por-rol-actividad"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3000/usuarios/estadisticas/mensuales-por-rol"
      );
      return res.data;
    },
  });

  const exportarPDF = async () => {
    if (!containerRef.current) return;

    const canvas = await html2canvas(containerRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    let position = 0;
    if (pdfHeight > pageHeight) {
      while (position < pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, -position, pageWidth, pdfHeight);
        position += pageHeight;
        if (position < pdfHeight) pdf.addPage();
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    }

    pdf.save("usuarios_por_rol_actividad.pdf");
  };

  if (isLoading) return <p className="p-6 text-lg text-center">Cargando...</p>;
  if (error || !data) return <p className="p-6 text-lg text-red-600 text-center">Error al cargar datos.</p>;

  const mesesUnicos = Array.from(
    new Set(
      data.flatMap((item) => [
        ...Object.keys(item.solicitudes || {}),
        ...Object.keys(item.entregas || {}),
      ])
    )
  );

  const ReportContent = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-6xl mx-auto space-y-10 border border-gray-200">
      <table className="w-full text-sm border border-gray-300 rounded text-center">
        <thead className="bg-indigo-100 text-indigo-900 uppercase">
          <tr>
            <th className="px-2 py-2 border">Rol</th>
            {mesesUnicos.map((mes) => (
              <th key={mes} colSpan={2} className="px-2 py-2 border">
                {mes.charAt(0).toUpperCase() + mes.slice(1)}
              </th>
            ))}
          </tr>
          <tr className="bg-indigo-50">
            <th></th>
            {mesesUnicos.map((mes) => (
              <td key={mes + "s"} className="px-1 py-1 border font-semibold">
                Sol
              </td>
            ))}
            {mesesUnicos.map((mes) => (
              <td key={mes + "e"} className="px-1 py-1 border font-semibold">
                Ent
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="text-indigo-800 divide-y divide-gray-200">
          {data.map((rol, i) => (
            <tr key={i} className="hover:bg-indigo-50 text-xs">
              <td className="px-2 py-2 font-medium">{rol.rol}</td>
              {mesesUnicos.map((mes) => (
                <td key={mes + "s" + i} className="border px-1 py-1">
                  {rol.solicitudes?.[mes] ?? 0}
                </td>
              ))}
              {mesesUnicos.map((mes) => (
                <td key={mes + "e" + i} className="border px-1 py-1">
                  {rol.entregas?.[mes] ?? 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Reporte de Solicitudes y Entregas por Rol
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl">
              Este reporte muestra la actividad mensual de solicitudes y entregas
              realizadas por los usuarios, agrupadas por rol.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setShowPreview(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Previsualizar
            </Button>
            <Button
              onClick={exportarPDF}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg shadow"
            >
              Exportar PDF
            </Button>
          </div>
        </div>

        <div ref={containerRef}>
          <ReportContent />
        </div>

        {showPreview && (
          <Modal onClose={() => setShowPreview(false)}>
            <div className="p-6 bg-white rounded-lg shadow-lg max-h-[80vh] overflow-auto">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-indigo-700">Previsualización del Reporte</h2>
              </div>
              <hr className="my-2 border-gray-200" />
              <ReportContent />
            </div>
          </Modal>
        )}
      </div>
    </DefaultLayout>
  );
}
