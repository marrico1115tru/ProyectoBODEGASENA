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

interface ProductoPorSitio {
  nombreProducto: string;
  nombreSitio: string | null;
  stock: string | null;
}

export default function ProductosPorSitio() {
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

        const url = `/permisos/por-ruta?ruta=/report/productosRep/ProductosPorSitio&idRol=${rolId}`;
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

  const { data, isLoading, error } = useQuery<ProductoPorSitio[]>({
    queryKey: ['productos-por-sitio'],
    queryFn: async () => {
      const res = await axiosInstance.get('/productos/por-sitio', { withCredentials: true });
      return res.data;
    },
    enabled: permisos.puedeVer,
  });

  const exportarPDF = async () => {
    if (!containerRef.current) return;

    const canvas = await html2canvas(containerRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

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

    pdf.save('reporte_productos_por_sitio.pdf');
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

  if (isLoading) return <p className="p-6">Cargando datos...</p>;
  if (error) return <p className="p-6 text-red-500">Error al cargar datos.</p>;
  if (!Array.isArray(data)) return <p className="p-6">No se encontraron datos válidos.</p>;

  const ReportContent = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-800">INNOVASOFT</h2>
        <p className="text-lg text-gray-600">Reporte de Productos por Sitio</p>
        <p className="text-sm text-gray-500 mt-1">
          Generado automáticamente — {new Date().toLocaleDateString()}
        </p>
        <hr className="my-4 border-t-2 border-gray-200" />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-800 text-white">
            <th className="p-3 border border-gray-300 text-left">#</th>
            <th className="p-3 border border-gray-300 text-left">Producto</th>
            <th className="p-3 border border-gray-300 text-left">Sitio</th>
            <th className="p-3 border border-gray-300 text-right">Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="p-3 border border-gray-300">{index + 1}</td>
              <td className="p-3 border border-gray-300">{item?.nombreProducto ?? "N/A"}</td>
              <td className="p-3 border border-gray-300">{item?.nombreSitio ?? "No asignado"}</td>
              <td className="p-3 border border-gray-300 text-right">{item?.stock ?? "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-800">Productos por Sitio</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowPreview(true)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Previsualizar
            </Button>
            <Button
              onClick={exportarPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
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
            <div className="p-6 max-h-[80vh] overflow-auto bg-white rounded-lg shadow-lg">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-blue-700">Previsualización del Reporte</h2>
              </div>
              <hr className="my-2 border-t-2 border-gray-200" />
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
