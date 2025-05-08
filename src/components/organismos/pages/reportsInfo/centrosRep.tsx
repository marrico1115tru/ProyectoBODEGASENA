import React, { useState, useRef } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import { fetchCentrosFormacion, CentroFormacion } from "@/Api/centrosFormacion";
import { getUsers } from "@/Api/Usuariosform";

const ReporteCentros: React.FC = () => {
  const today = dayjs();
  const firstDay = today.subtract(1, "month").startOf("month").format("YYYY-MM-DD");
  const lastDay = today.subtract(1, "month").endOf("month").format("YYYY-MM-DD");
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [reportType, setReportType] = useState("productos");
  const [reportData, setReportData] = useState([]);
  const [zoom, setZoom] = useState(1);

  const componentRef = useRef();

  const handleGenerate = async () => {
    try {
      const users = await getUsers();
      setReportData(users);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  // const handleGenerate = async () => {
  //   setLoading(true);
  //   setReportData([]);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   const mockData = {
  //     productos: [
  //       { nombre: "Producto A", cantidad: 10 },
  //       { nombre: "Producto B", cantidad: 20 }
  //     ],
  //     sitios: [
  //       { sitio: "Sitio Norte", visitas: 123 },
  //       { sitio: "Sitio Sur", visitas: 98 }
  //     ],
  //     usuarios: [
  //       { usuario: "Juan", email: "juan@example.com" },
  //       { usuario: "Ana", email: "ana@example.com" }
  //     ],
  //     areas: [
  //       { area: "Administración", empleados: 5 },
  //       { area: "Operaciones", empleados: 12 }
  //     ]
  //   };

  //   setReportData(mockData[reportType] || []);
  //   setLoading(false);
  // };

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(componentRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("reporte.pdf");
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-screen-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Generar Reporte</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="productos">Productos</option>
            <option value="sitios">Sitios</option>
            <option value="usuarios">Usuarios</option>
            <option value="areas">Áreas</option>
          </select>
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            disabled={loading}
          >
            {loading ? "Generando..." : "Generar reporte"}
          </button>
        </div>

        {reportData.length > 0 && (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Descargar PDF
              </button>
              <button
                onClick={handlePrint}
                className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
              >
                Imprimir
              </button>
              <button
                onClick={() => setZoom((z) => z + 0.1)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Zoom +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Zoom -
              </button>
            </div>

            <div
              ref={componentRef}
              style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
              className="bg-white p-4 shadow border rounded"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Reporte de {reportType}</h2>
              <p className="text-sm text-gray-600 mb-1">
                Desde: <strong>{startDate}</strong> - Hasta: <strong>{endDate}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">Este reporte muestra un resumen de los datos seleccionados.</p>

              <table className="w-full table-auto border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    {Object.keys(reportData[0]).map((key) => (
                      <th key={key} className="border px-3 py-2">{key.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-3 py-2 text-gray-800">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReporteCentros;
