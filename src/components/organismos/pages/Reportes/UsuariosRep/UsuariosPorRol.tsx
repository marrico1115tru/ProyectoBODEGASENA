import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";
import Modal from "@/components/ui/Modal";
import { getDecodedTokenFromCookies } from '@/lib/utils';

interface UsuarioPorRol {
  nombreRol: string;
  cantidad: string; // viene como string según la API
}

export default function UsuariosPorRolCantidad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Estado de permisos
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  // Cargar permisos al montar el componente
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/por-ruta?ruta=/report/UsuariosRep/UsuariosPorRol&idRol=${rolId}`;
        const response = await axios.get(url, { withCredentials: true });
        const permisosData = response.data.data;

        if (permisosData) {
          setPermisos({
            puedeVer: Boolean(permisosData.puedeVer),
            puedeCrear: Boolean(permisosData.puedeCrear),
            puedeEditar: Boolean(permisosData.puedeEditar),
            puedeEliminar: Boolean(permisosData.puedeEliminar),
          });
        } else {
          setPermisos({
            puedeVer: false,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false,
          });
        }
      } catch (error) {
        console.error('Error al obtener permisos:', error);
        setPermisos({
          puedeVer: false,
          puedeCrear: false,
          puedeEditar: false,
          puedeEliminar: false,
        });
      }
    };
    fetchPermisos();
  }, []);

  // Obtener datos solo si permiso para ver es true
  const { data, isLoading, error } = useQuery<UsuarioPorRol[]>({
    queryKey: ["usuarios-por-rol"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3000/usuarios/estadisticas/por-rol",
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: permisos.puedeVer,
  });

  // Exportar a PDF
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

    pdf.save("usuarios_por_rol.pdf");
  };

  // Mostrar mensaje si no tiene permiso para ver
  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-6 text-center font-semibold text-red-600">
          No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  if (isLoading) return <p className="p-6 text-lg text-center">Cargando...</p>;
  if (error || !data) return <p className="p-6 text-lg text-red-600 text-center">Error al cargar datos.</p>;

  const ReportContent = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl mx-auto space-y-6 border border-gray-200">
      <table className="w-full text-sm border border-gray-300 rounded text-center">
        <thead className="bg-indigo-100 text-indigo-900 uppercase">
          <tr>
            <th className="px-4 py-2 border">Rol</th>
            <th className="px-4 py-2 border">Cantidad de usuarios</th>
          </tr>
        </thead>
        <tbody className="text-indigo-800 divide-y divide-gray-200">
          {data.map((rol, i) => (
            <tr key={i} className="hover:bg-indigo-50 text-sm">
              <td className="px-4 py-2 border font-medium">{rol.nombreRol}</td>
              <td className="px-4 py-2 border">{parseInt(rol.cantidad, 10)}</td>
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
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Reporte de Usuarios por Rol</h1>
            <p className="text-gray-600 text-sm max-w-2xl">
              Este reporte muestra cuántos usuarios hay agrupados por su rol en el sistema.
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
