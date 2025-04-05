import { Button } from "@/components/ui/button"; 

const InventoryLanding = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {}
      <div className="bg-blue-200 p-4 flex justify-between items-center">
        <div className="text-lg font-bold flex items-center space-x-2">
          <img src="/src/img/logoinnovasoft.png" alt="Logo" className="h-8" /> {}
          <span className="text-gray-700">INNOVASOFT</span>
        </div>
        <Button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          Ingresar
        </Button>
      </div>

      {}
      <div className="flex flex-col md:flex-row items-center justify-center p-8 gap-6">
        {}
        <div className="w-full md:w-1/3 shadow-lg">
          <img
            src="/src/img/logoinnovasoft.png"
            alt="Bodega"
            className="rounded-lg"
          />
        </div>

        {}
        <div className="md:w-2/3">
          <h2 className="font-bold text-xl md:text-2xl mb-2">
            “Gestiona tu inventario con precisión y eficiencia”
          </h2>
          <p className="text-gray-700 text-sm md:text-base">
            Nuestro sistema de inventario de bodega te permite gestionar y controlar 
            eficientemente el stock de productos. Con una interfaz intuitiva, puedes realizar 
            un seguimiento de entradas, salidas y niveles de inventario en tiempo real. Optimiza 
            la logística, reduce errores y garantiza que siempre tengas control total sobre tu 
            inventario desde cualquier dispositivo.
          </p>
        </div>
      </div>

      {}
      <div className="bg-blue-200 p-4 text-gray-800 text-sm">
        <p className="font-bold">ENCUÉNTRANOS EN:</p>
        <p>
          <span className="font-semibold">CELULAR:</span> 3123456789<br />
          San Agustín - Huila.
        </p>
      </div>
    </div>
  );
};

export default InventoryLanding;
