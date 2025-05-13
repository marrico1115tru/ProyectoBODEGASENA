import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center bg-gradient-to-r from-white to-blue-50 w-full py-10 px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center">
            <img
              src="src/img/logoinnovasoft.png" 
              className="w-64 h-auto object-contain"
            />
          </div>

          {}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              Gestiona tu inventario con precisión y eficiencia
            </h1>
            <p className="text-gray-700 text-lg mb-4">
              Nuestro sistema de inventario de bodega te permite gestionar y controlar eficientemente el stock de productos. Con una interfaz intuitiva, puedes realizar un seguimiento de entradas, salidas y niveles de inventario en tiempo real.
            </p>
            <p className="text-gray-700 text-lg">
              Optimiza la logística, reduce errores y garantiza que siempre tengas control total sobre tu inventario desde cualquier dispositivo.
            </p>
          </div>
        </div>

        {}
        <footer className="mt-16 text-center">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">ENCUÉNTRANOS EN:</h3>
          <p className="text-sm text-gray-700">CELULAR: 3123456789</p>
          <p className="text-sm text-gray-700">San Agustín - Huila.</p>
        </footer>
      </section>
    </DefaultLayout>
  );
}
