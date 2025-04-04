interface VerPDFModalProps {
    isOpen: boolean;
    pdfUrl: string | null;
    onDownload: () => void;
    onClose: () => void;
  }
  
  const VerPDF = ({ isOpen, pdfUrl, onDownload, onClose }: VerPDFModalProps) => {
    if (!isOpen || !pdfUrl) return null;
  
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg w-3/4 h-3/4">
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            title="PDF Previsualización"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={onDownload}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Descargar PDF
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default VerPDF;