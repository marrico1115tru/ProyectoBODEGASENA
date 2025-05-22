import { jsPDF } from "jspdf"; 

export default function DownloadPdf() { 
  const handleDownload = () => { 
    const doc = new jsPDF();
    doc.text("¡Hola, este es un PDF generado en React!", 10, 10); 
    doc.save("documento.pdf"); 
  };

  return (
    <button 
      onClick={handleDownload} 
      className="bg-blue-500 text-white px-4 py-2 rounded">
      Descargar PDF
    </button>
  );
}