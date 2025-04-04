import { jsPDF } from "jspdf"; 

export default function DownloadPdf() {  // DownloadPdf=>función que retorna  un JSX
  const handleDownload = () => { //   handleDownload=> función que se ejecuta al dar clic en descargar
    const doc = new jsPDF();
    doc.text("¡Hola, este es un PDF generado en React!", 10, 10); 
    doc.save("documento.pdf"); // guarda el archivo generado y al ejecutarse pide al usuario que lo descargue 
  };
// Boton de descarga
  return (
    <button 
      onClick={handleDownload} // cuando el usuario haga clic en el boton se genere y descargue el PDF
      className="bg-blue-500 text-white px-4 py-2 rounded">
      Descargar PDF
    </button>
  );
}