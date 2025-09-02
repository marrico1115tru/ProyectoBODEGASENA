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

interface ProductoVencido {
  id: number;
  nombre: string;
  fechaVencimiento: string;
  inventarios: { stock: number }[];
}

export default function ProductosVencidos() {
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

        const url = `/permisos/por-ruta?ruta=/report/productosRep/ProductosVencidos&idRol=${rolId}`;
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

  const { data, isLoading, error } = useQuery<ProductoVencido[]>({
    queryKey: ['productos-vencidos'],
    queryFn: async () => {
      const res = await axiosInstance.get('/productos/vencidos', { withCredentials: true });
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

    pdf.save('reporte_productos_vencidos.pdf');
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

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-500">Error al cargar productos vencidos.</p>;
  if (!Array.isArray(data)) return <p className="p-6">No se encontraron datos.</p>;

  const ReportContent = () => (
    <div className="bg-gradient-to-tr from-blue-100 via-white to-blue-150 p-10 rounded-3xl shadow-2xl max-w-6xl mx-auto border border-gray-300">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-700 rounded-full px-6 py-3 mb-4 shadow-lg shadow-blue-400/25">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow">INNOVASOFT</h2>
        </div>
        <p className="text-xl text-blue-900 font-semibold mb-2">Reporte de Productos Vencidos</p>
        <p className="text-sm text-gray-600 mb-3">
          Generado automáticamente — {new Date().toLocaleDateString()}
        </p>
        <div className="bg-blue-200 border-l-6 border-blue-800 text-blue-900 px-6 py-5 mb-6 w-full md:w-3/4 text-center rounded-xl shadow-md shadow-blue-300/40 font-semibold leading-relaxed">
          Este reporte contiene el detalle de productos que han superado su fecha de vencimiento registrada, con cantidades disponibles en stock.
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-gray-300 shadow-xl shadow-gray-300/40">
        <table className="w-full border-collapse text-sm bg-white rounded-2xl">
          <thead>
            <tr className="bg-blue-600 text-white uppercase shadow-inner shadow-blue-700">
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">#</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Nombre del Producto</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Fecha de Vencimiento</th>
              <th className="p-4 border border-gray-300 font-semibold tracking-wide">Cantidad Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((prod, index) => {
              const cantidadTotal = prod.inventarios?.reduce(
                (acc, inv) => acc + (inv?.stock ?? 0),
                0
              );

              return (
                <tr
                  key={prod.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  style={{ transition: "background-color 0.3s ease" }}
                >
                  <td className="p-4 border border-gray-200">{index + 1}</td>
                  <td className="p-4 border border-gray-200">{prod.nombre}</td>
                  <td className="p-4 border border-gray-200">
                    {prod.fechaVencimiento ? new Date(prod.fechaVencimiento).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </td>
                  <td className="p-4 border border-gray-200">{cantidadTotal > 0 ? cantidadTotal : 'Sin stock'}</td>
                </tr>
              );
            })}
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
            Productos Vencidos
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
