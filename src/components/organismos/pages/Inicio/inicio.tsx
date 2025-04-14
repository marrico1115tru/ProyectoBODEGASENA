import { Button } from "@/components/ui/button";

const InventoryLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 text-gray-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-md border-b">
        <div className="flex items-center space-x-4">
          <img
            src="/src/img/logoinnovasoft.png"
            alt="Logo"
            className="h-12 w-12 rounded-full shadow border border-blue-200"
          />
          <span className="text-2xl font-bold tracking-wider text-blue-800 drop-shadow-sm">
            INNOVASOFT
          </span>
        </div>
        <Button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow">
          Iniciar sesión
        </Button>
      </header>

      {/* Main content */}
      <main className="flex flex-col md:flex-row items-center justify-center gap-10 p-10 flex-grow">
        {/* Left image */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <img
            src="/src/img/logoinnovasoft.png"
            alt="Bodega"
            className="rounded-xl mx-auto max-h-60 object-contain"
          />
        </div>

        {/* Right description */}
        <div className="md:w-2/3 text-center md:text-left space-y-5">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 leading-snug">
            Gestiona tu inventario con precisión y eficiencia
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Nuestro sistema de inventario de bodega te permite gestionar y controlar eficientemente el stock de productos. Con una interfaz intuitiva, puedes realizar un seguimiento de entradas, salidas y niveles de inventario en tiempo real.
            <br />
            <br />
            Optimiza la logística, reduce errores y garantiza que siempre tengas control total sobre tu inventario desde cualquier dispositivo.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-5 px-6 text-center text-gray-700 text-sm border-t">
        <p className="font-bold text-blue-800 mb-2">ENCUÉNTRANOS EN:</p>
        <p>
          <span className="font-semibold">CELULAR:</span> 3123456789 <br />
          San Agustín - Huila.
        </p>
      </footer>
    </div>
  );
};

export default InventoryLanding;
