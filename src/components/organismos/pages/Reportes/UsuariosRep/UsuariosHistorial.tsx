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
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-5xl mx-auto border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">INNOVASOFT</h2>
        <p className="text-sm text-gray-500">
          Reporte generado automáticamente —{' '}
          {new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className="mt-2 text-gray-700">Usuarios que más han utilizado productos según su historial.</p>
      </div>

      <table className="w-full text-center border-collapse border border-gray-300">
        <thead className="bg-blue-200 text-blue-900 text-md">
          <tr>
            <th className="p-3 border">#</th>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Apellido</th>
            <th className="p-3 border">Total de Solicitudes</th>
          </tr>
        </thead>
        <tbody className="text-sm text-blue-800">
          {data.map((usuario, index) => (
            <tr key={usuario.id} className="hover:bg-blue-50">
              <td className="p-3 border font-bold text-blue-700">{index + 1}</td>
              <td className="p-3 border">{usuario.nombre}</td>
              <td className="p-3 border">{usuario.apellido}</td>
              <td className="p-3 border">{usuario.total_solicitudes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">Usuarios con Mayor Uso de Productos</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowPreview(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Previsualizar
            </Button>
            <Button
              onClick={exportarPDF}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
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
                <h2 className="text-2xl font-bold text-blue-700">Previsualización del Reporte</h2>
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
