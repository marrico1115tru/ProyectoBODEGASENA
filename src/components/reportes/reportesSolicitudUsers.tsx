import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Producto {
  nombre: string;
  categoria: string;
}

interface Detalle {
  cantidad_solicitada: number;
  productos: Producto;
}

interface Solicitud {
  fecha_solicitud: string;
  estado_solicitud: string;
  detalle_solicitud: Detalle[];
}

interface Usuario {
  nombre: string;
  apellido: string;
  solicitudes: Solicitud[];
}

const ReportSolicitudesUsuario = () => {
  const [data, setData] = useState<Usuario[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/reportes/solicitudes-por-usuario')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const downloadPDF = async () => {
    const input = reportRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('reporte-solicitudes-por-usuario.pdf');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reporte de Solicitudes por Usuario</h2>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Descargar PDF
        </button>
      </div>

      <div ref={reportRef} className="space-y-6">
        {data.map((usuario, i) => (
          <div key={i} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{usuario.nombre} {usuario.apellido}</h3>
            {usuario.solicitudes.map((sol, j) => (
              <div key={j} className="mt-2 p-2 bg-gray-100 rounded">
                <p><strong>Fecha:</strong> {new Date(sol.fecha_solicitud).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {sol.estado_solicitud}</p>
                <ul className="list-disc pl-5">
                  {sol.detalle_solicitud.map((det, k) => (
                    <li key={k}>
                      {det.productos.nombre} ({det.productos.categoria}) - Cantidad: {det.cantidad_solicitada}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportSolicitudesUsuario;
