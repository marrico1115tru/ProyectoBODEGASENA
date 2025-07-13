import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Centro = {
  id: number;
  nombre: string;
  ubicacion: string;
  telefono?: string;
  fecha_registro: string;
};

export default function ReporteCentrosFormacion() {
  const [centros, setCentros] = useState<Centro[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/centros");
        setCentros(res.data);
      } catch (error) {
        console.error("Error al obtener los centros:", error);
      }
    };
    fetchCentros();
  }, []);

  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save("reporte_centros.pdf");
  };


  const ubicacionesMap: Record<string, number> = {};
  centros.forEach((centro) => {
    ubicacionesMap[centro.ubicacion] = (ubicacionesMap[centro.ubicacion] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(ubicacionesMap),
    datasets: [
      {
        label: "Centros por Ubicación",
        data: Object.values(ubicacionesMap),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Centros de Formación Registrados</h2>

      <div ref={chartRef} className="bg-gray-100 p-4 rounded-lg space-y-6">
     
        <Bar data={chartData} options={chartOptions} />

   
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Ubicación</th>
                <th className="px-4 py-2 text-left">Teléfono</th>
                <th className="px-4 py-2 text-left">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {centros.map((centro) => (
                <tr key={centro.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{centro.nombre}</td>
                  <td className="px-4 py-2">{centro.ubicacion}</td>
                  <td className="px-4 py-2">{centro.telefono || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(centro.fecha_registro).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

 
      <div className="mt-6 flex justify-center">
        <Button onClick={handleDownloadPDF} className="flex gap-2">
          <Download size={16} />
          Descargar PDF
        </Button>
      </div>
    </div>
  );
}
