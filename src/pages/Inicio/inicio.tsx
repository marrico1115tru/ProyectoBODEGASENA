import { Button } from "@/components/ui/button";

const InventoryLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex flex-col font-sans">
      {/* Header */}
      <div className="bg-blue-300 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/src/img/logoinnovasoft.png" alt="Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="text-2xl font-semibold text-gray-800 tracking-wide">INNOVASOFT</span>
        </div>
        <Button className="bg-white text-blue-600 px-4 py-2 rounded-full border hover:bg-blue-600 hover:text-white transition">
          Iniciar sesión
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-10 flex-grow">
        {/* Left image */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-xl p-4">
          <img
            src="/src/img/logoinnovasoft.png"
            alt="Bodega"
            className="rounded-xl mx-auto"
          />
        </div>

        {/* Right description */}
        <div className="md:w-2/3 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-4">
            “Gestiona tu inventario con precisión y eficiencia”
          </h2>
          <p className="text-gray-700 text-base leading-relaxed">
            Nuestro sistema de inventario de bodega te permite gestionar y controlar eficientemente el stock de productos. Con una interfaz intuitiva, puedes realizar un seguimiento de entradas, salidas y niveles de inventario en tiempo real. 
            <br /><br />
            Optimiza la logística, reduce errores y garantiza que siempre tengas control total sobre tu inventario desde cualquier dispositivo.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-100 py-4 px-6 text-center text-gray-700 text-sm border-t">
        <p className="font-bold mb-1">ENCUÉNTRANOS EN:</p>
        <p>
          <span className="font-semibold">CELULAR:</span> 3123456789 <br />
          San Agustín - Huila.
        </p>
      </div>
    </div>
  );
};

export default InventoryLanding;
