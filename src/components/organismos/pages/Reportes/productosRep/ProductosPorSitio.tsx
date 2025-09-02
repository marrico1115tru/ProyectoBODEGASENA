'use client';

import { useQuery } from '@tanstack/react-query';
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/default';
import Modal from '@/components/ui/Modal';
import axiosInstance from '@/Api/axios';
import { getDecodedTokenFromCookies } from '@/lib/utils';

interface ProductoReporte {
  idsolicitud: number;
  solicitante: string;
  producto: string;
  cantidadsolicitada: number | null;
  sitioalmacen: string | null;
  fechaentrega: string | null;
  estadosolicitud: string | null;
}

export default function ReporteProductosCompleto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [permisos, setPermisos] = useState({ puedeVer: false });

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const userData = getDecodedTokenFromCookies('token');
        const rolId = userData?.rol?.id;
        if (!rolId) return;
        const url = `/permisos/por-ruta?ruta=/report/productosRep/ProductosPorSitio&idRol=${rolId}`;
        const response = await axiosInstance.get(url, { withCredentials: true });
        const permisosData = response.data.data;
        setPermisos({ puedeVer: Boolean(permisosData?.puedeVer || false) });
      } catch (error) {
        setPermisos({ puedeVer: false });
      }
    };
    fetchPermisos();
  }, []);

  const { data, isLoading, error } = useQuery<ProductoReporte[]>({
    queryKey: ['reporte-productos-completo'],
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
    pdf.save('reporte_productos_completo.pdf');
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
  if (!Array.isArray(data) || data.length === 0)
    return <p className="p-6">No se encontraron datos válidos.</p>;

  const ReportContent = () => (
    <div className="bg-gradient-to-tr from-blue-100 via-white to-blue-150 p-10 rounded-3xl shadow-2xl max-w-6xl mx-auto border border-gray-300">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-700 rounded-full px-6 py-3 mb-4 shadow-lg shadow-blue-400/25">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow">INNOVASOFT</h2>
        </div>
        <p className="text-xl text-blue-900 font-semibold mb-2">Informe completo de productos</p>
        <p className="text-sm text-gray-600 mb-3">
          Generado automáticamente — {new Date().toLocaleDateString()}
        </p>
        <div className="bg-blue-200 border-l-6 border-blue-800 text-blue-900 px-6 py-5 mb-6 w-full md:w-3/4 text-center rounded-xl shadow-md shadow-blue-300/40 font-semibold leading-relaxed">
          Este reporte muestra el resumen detallado de todas las solicitudes de productos realizadas en el sistema, incluyendo información de cada solicitud, estado, fecha de entrega y sitio de almacenamiento.
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-gray-300 shadow-xl shadow-gray-300/40">
        <table className="w-full border-collapse text-sm bg-white rounded-2xl">
          <thead>
            <tr className="bg-blue-600 text-white uppercase shadow-inner shadow-blue-700">
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">ID Solicitud</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Producto</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Cantidad Solicitada</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Solicitante</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Sitio Almacenamiento</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Fecha Entrega</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Estado Solicitud</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                style={{ transition: "background-color 0.3s ease" }}
              >
                <td className="p-4 border border-gray-200">{item.idsolicitud}</td>
                <td className="p-4 border border-gray-200">{item.producto}</td>
                <td className="p-4 border border-gray-200">{item.cantidadsolicitada ?? 'N/A'}</td>
                <td className="p-4 border border-gray-200">{item.solicitante}</td>
                <td className="p-4 border border-gray-200">{item.sitioalmacen ?? 'No asignado'}</td>
                <td className="p-4 border border-gray-200">{item.fechaentrega ?? 'N/A'}</td>
                <td className="p-4 border border-gray-200 text-blue-800 font-bold">
                  {item.estadosolicitud ?? 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center text-xs text-gray-400 font-mono select-none">
        Reporte generado por INNOVASOFT | Todos los derechos reservados {new Date().getFullYear()}
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-10 bg-gradient-to-br from-blue-100 via-white to-blue-150 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-md">
            Reporte Completo de Productos
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
