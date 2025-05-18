import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";
import Modal from "@/components/ui/Modal";

export default function UsuariosPorRolActividad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["usuarios-por-rol-actividad"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3500/api/usuarios/usuarios-por-rol-actividad"
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
  if (error) return <p className="p-6 text-lg text-red-600 text-center">Error al cargar datos.</p>;

  const ReportContent = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-6xl mx-auto space-y-10 border border-gray-200">
      {data.map((rol: any, i: number) => (
        <div key={i}>
          <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-200 pb-2 mb-4 text-center">
            {rol.nombreRol}
          </h2>

          {rol.usuarios.length === 0 ? (
            <p className="text-gray-500 italic text-sm text-center">No hay usuarios en este rol.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm border border-gray-300 rounded">
                <thead className="bg-indigo-100 text-indigo-900 uppercase">
                  <tr>
                    <th className="px-2 py-2 border">Nombre</th>
                    <th className="px-2 py-2 border">Correo</th>
                    <th className="px-2 py-2 border">Solicitudes</th>
                    <th className="px-2 py-2 border">Entregas</th>
                  </tr>
                </thead>
                <tbody className="text-indigo-800 divide-y divide-gray-200">
                  {rol.usuarios.map((usuario: any) => (
                    <tr
                      key={usuario.id}
                      className="hover:bg-indigo-50 text-xs"
                    >
                      <td className="px-2 py-1 font-medium">
                        {usuario.nombre} {usuario.apellido}
                      </td>
                      <td className="px-2 py-1 text-gray-700">{usuario.email}</td>
                      <td className="px-2 py-1">{usuario._count?.solicitudes || 0}</td>
                      <td className="px-2 py-1">{usuario._count?.entregas || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Usuarios por Rol y Actividad
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl">
              Este informe presenta los usuarios agrupados por su rol en el sistema,
              junto con su actividad en solicitudes y entregas.
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
