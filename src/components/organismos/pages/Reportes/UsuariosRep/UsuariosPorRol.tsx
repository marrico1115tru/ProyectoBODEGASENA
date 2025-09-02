'use client';

import { useQuery } from '@tanstack/react-query';
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/default';
import Modal from '@/components/ui/Modal';
import axiosInstance from '@/Api/axios'; 
import { getDecodedTokenFromCookies } from '@/lib/utils';

interface UsuarioPorRol {
  nombreRol: string;
  cantidad: string; 
}

export default function UsuariosPorRolCantidad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `/permisos/por-ruta?ruta=/report/UsuariosRep/UsuariosPorRol&idRol=${rolId}`;
        const response = await axiosInstance.get(url, { withCredentials: true });
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

  const { data, isLoading, error } = useQuery<UsuarioPorRol[]>({
    queryKey: ['usuarios-por-rol'],
    queryFn: async () => {
      const res = await axiosInstance.get('/usuarios/estadisticas/por-rol', { withCredentials: true });
      return res.data;
    },
    enabled: permisos.puedeVer,
  });

  const exportarPDF = async () => {
    if (!containerRef.current) return;

    const canvas = await html2canvas(containerRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    let position = 0;
    if (pdfHeight > pageHeight) {
      while (position < pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, -position, pageWidth, pdfHeight);
        position += pageHeight;
        if (position < pdfHeight) pdf.addPage();
      }
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
    }

    pdf.save('usuarios_por_rol.pdf');
  };

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
    <div className="bg-gradient-to-tr from-blue-100 via-white to-blue-150 p-10 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto border border-gray-300">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-blue-800 drop-shadow">
          INNOVASOFT
        </h2>
        <p className="text-sm text-gray-600">
          Reporte generado automáticamente — {new Date().toLocaleDateString()}
        </p>
        <p className="mt-2 text-gray-700 font-semibold max-w-xl mx-auto">
          Este reporte muestra cuántos usuarios hay agrupados por su rol en el sistema.
        </p>
      </div>

      <table className="w-full text-center border-collapse border border-gray-300 rounded-xl overflow-hidden shadow-lg shadow-gray-300/40 bg-white">
        <thead className="bg-indigo-600 text-white text-md uppercase shadow-inner shadow-indigo-700">
          <tr>
            <th className="p-4 border border-indigo-500 font-semibold">Rol</th>
            <th className="p-4 border border-indigo-500 font-semibold">Cantidad de usuarios</th>
          </tr>
        </thead>
        <tbody className="text-sm text-indigo-900">
          {data.map((rol, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-indigo-50"}
              style={{ transition: "background-color 0.3s ease" }}
            >
              <td className="p-4 border border-indigo-200 font-medium">{rol.nombreRol}</td>
              <td className="p-4 border border-indigo-200">{parseInt(rol.cantidad, 10)}</td>
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
