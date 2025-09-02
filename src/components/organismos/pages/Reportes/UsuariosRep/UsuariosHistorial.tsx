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

interface UsuarioMayorUso {
  id: number;
  nombre: string;
  apellido: string;
  total_solicitudes: number;
}

export default function UsuariosMayorUso() {
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

        const url = `/permisos/por-ruta?ruta=/report/UsuariosRep/UsuariosHistoria&idRol=${rolId}`;
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

  const { data, isLoading, error } = useQuery<UsuarioMayorUso[]>({
    queryKey: ['usuarios-mayor-uso-productos'],
    queryFn: async () => {
      const res = await axiosInstance.get('/usuarios/usuarios-top-solicitudes', { withCredentials: true });
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

    pdf.save('usuarios_mayor_uso_productos.pdf');
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
  if (error) return <p className="p-6 text-lg text-red-600 text-center">Error al cargar datos.</p>;
  if (!Array.isArray(data)) return <p className="p-6 text-lg text-center">No se encontraron datos.</p>;

  const ReportContent = () => (
    <div className="bg-gradient-to-tr from-blue-100 via-white to-blue-150 p-10 rounded-3xl shadow-2xl w-full max-w-5xl mx-auto border border-gray-300">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-blue-800 drop-shadow">
          INNOVASOFT
        </h2>
        <p className="text-sm text-gray-600">
          Reporte generado automáticamente —{' '}
          {new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className="mt-2 text-gray-700 font-semibold">
          Usuarios que más han utilizado productos según su historial.
        </p>
      </div>

      <table className="w-full text-center border-collapse border border-gray-300 rounded-xl overflow-hidden shadow-lg shadow-gray-300/40 bg-white">
        <thead className="bg-blue-600 text-white text-md uppercase shadow-inner shadow-blue-700">
          <tr>
            <th className="p-4 border border-blue-500 font-semibold">#</th>
            <th className="p-4 border border-blue-500 font-semibold">Nombre</th>
            <th className="p-4 border border-blue-500 font-semibold">Apellido</th>
            <th className="p-4 border border-blue-500 font-semibold">Total de Solicitudes</th>
          </tr>
        </thead>
        <tbody className="text-sm text-blue-900">
          {data.map((usuario, index) => (
            <tr
              key={usuario.id}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              style={{ transition: "background-color 0.3s ease" }}
            >
              <td className="p-4 border border-blue-200 font-bold">{index + 1}</td>
              <td className="p-4 border border-blue-200">{usuario.nombre}</td>
              <td className="p-4 border border-blue-200">{usuario.apellido}</td>
              <td className="p-4 border border-blue-200">{usuario.total_solicitudes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-10 bg-gradient-to-br from-blue-100 via-white to-blue-150 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-md">
            Usuarios con Mayor Uso de Productos
          </h1>
          <div className="flex gap-5">
            <Button
              onClick={() => setShowPreview(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg shadow-gray-400/40"
            >
              Previsualizar
            </Button>
            <Button
              onClick={exportarPDF}
              className="bg-blue-700 hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-xl shadow-lg shadow-blue-400/40"
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
            <div className="p-6 max-h-[80vh] overflow-auto bg-gradient-to-tr from-blue-50 via-white to-blue-100 rounded-3xl shadow-2xl border border-gray-300">
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-blue-700 drop-shadow-sm">
                  Previsualización del Reporte
                </h2>
              </div>
              <hr className="my-2 border-t-4 border-blue-200" />
              <div className="p-4">
                <ReportContent />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DefaultLayout>
  );
}
