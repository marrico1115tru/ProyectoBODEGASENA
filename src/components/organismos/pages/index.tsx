import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center w-full bg-slate-900 text-white py-10 px-6">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center border border-slate-700 rounded-2xl p-6 shadow-xl bg-slate-800">
          <div className="flex items-center justify-center">
            <img
              src="src/img/logoinnovasoft.png"
              alt="Logo Innovasoft"
              className="w-64 h-auto object-contain rounded-xl shadow-md"
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4">
              Gestiona tu inventario con precisión y eficiencia
            </h1>
            <p className="text-slate-300 text-lg mb-4">
              Nuestro sistema de inventario de bodega te permite gestionar y controlar eficientemente el stock de productos. Con una interfaz intuitiva, puedes realizar un seguimiento de entradas, salidas y niveles de inventario en tiempo real.
            </p>
            <p className="text-slate-300 text-lg">
              Optimiza la logística, reduce errores y garantiza que siempre tengas control total sobre tu inventario desde cualquier dispositivo.
            </p>
          </div>
        </div>

        <footer className="mt-16 text-center border-t border-slate-700 pt-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-1">ENCUÉNTRANOS EN:</h3>
          <p className="text-sm text-slate-300">CELULAR: 3123456789</p>
          <p className="text-sm text-slate-300">San Agustín - Huila</p>
        </footer>
      </section>
    </DefaultLayout>
  );
}
