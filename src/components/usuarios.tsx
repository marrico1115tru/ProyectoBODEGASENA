import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; //Convierte un elemento HTML en una imagen que se puede insertar en el PDF.
import { useRef, useState } from "react";
import VerPDF from "./VerPDF"; //Componente para previsualizar el PDF generado. 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


//Define el tipo de dato esperado para los usuarios. Cada usuario tiene una propiedad created_at (fecha de creación).
interface UsuarioData {
    created_at: string;
}


//Se hace una petición a http://localhost:3000/usuarios para obtener datos.
const fetchDatosGrafica = async (): Promise<UsuarioData[]> => {
    const respuesta = await fetch("http://localhost:3100/usuarios");
    if (!respuesta.ok) throw new Error("Error al obtener los datos");
    return respuesta.json();
};


//useQuery ejecuta fetchDatosGrafica y almacena la respuesta en data.
const Grafica = () => {
    const { data, error, isLoading } = useQuery<UsuarioData[]>({
        queryKey: ["datosGrafica"],
        queryFn: fetchDatosGrafica
    });


    //pdfUrl almacena la URL del PDF generado.
    //isModalOpen maneja si el modal de previsualización del PDF está abierto o cerrado.
    //chartRef es una referencia al contenedor del gráfico, utilizada para capturarlo como imagen.
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);

    const handleGeneratePdf = async () => {
        if (!chartRef.current) return;

        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.text("Usuarios registrados por fecha", 10, 10);
        pdf.addImage(imgData, "PNG", 10, 20, 180, 100);

        // Crear una URL del PDF generado para mostrar en la ventana emergente
        const blob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(blob);
        setPdfUrl(pdfUrl);
        setIsModalOpen(true);
    };

    const handleDownloadPDF = async () => {
        if (!chartRef.current) return;

        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.text("Usuarios registrados por fecha", 10, 10);
        pdf.addImage(imgData, "PNG", 10, 20, 180, 100);
        pdf.save("grafica.pdf");

        setIsModalOpen(false); // Cerrar el modal después de descargar
    };

    const handleCloseModal = () => setIsModalOpen(false); // cambia el estado del modal para cerrarlo

    if (isLoading) return <p>Cargando datos...</p>;
    if (error) return <p>Error al cargar los datos</p>;
    if (!data || data.length === 0) return <p>No hay datos disponibles</p>;


    //Agrupa usuarios por fecha y cuenta cuántos usuarios se registraron en cada fecha.

    const conteoPorFecha: Record<string, number> = {};
    data.forEach((usuario) => {
        const fecha = new Date(usuario.created_at).toLocaleDateString();
        conteoPorFecha[fecha] = (conteoPorFecha[fecha] || 0) + 1;
    });

    const labels = Object.keys(conteoPorFecha);
    const valores = Object.values(conteoPorFecha);

    const opciones: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Usuarios registrados por fecha" },
        },
    };

    const datosGrafica = {
        labels,
        datasets: [
            {
                label: "Cantidad de usuarios registrados",
                data: valores,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <div ref={chartRef}>
                <Bar data={datosGrafica} options={opciones} />
            </div>

            {/* Botón para generar PDF y visualizarlo */}
            <button
                onClick={handleGeneratePdf}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Ver PDF
            </button>

            {/* Componente para previsualización y descarga del PDF */}
            <VerPDF
                isOpen={isModalOpen}
                pdfUrl={pdfUrl}
                onDownload={handleDownloadPDF}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default Grafica;