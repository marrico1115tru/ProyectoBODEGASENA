import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Button } from "@/components/ui/button";
import { RocketLaunchIcon, CheckCircleIcon, UserGroupIcon } from "@heroicons/react/24/solid";

export default function IndexPage() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/InicioDash");
  };

  return (
    <DefaultLayout>
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <img
              src="src/img/log.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
            <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">
              Gestiona tu inventario con <br />
              <span className="text-blue-600">precisión y eficiencia</span>
            </h1>
            <p className="text-slate-600 text-lg">
              Optimiza tu logística, reduce errores y garantiza un control total del stock.
            </p>
            <Button className="mt-4" size="lg" onClick={handleRedirect}>
              Explorar plataforma
            </Button>
          </div>
          <div className="hidden md:block">
            <img
              src="src/img/bodegas.jpeg"
              alt="Gestión de inventario"
              className="w-full max-h-[400px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
            ¿Por qué elegir nuestro sistema?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-xl p-6 shadow-md text-center">
              <RocketLaunchIcon className="mx-auto h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg">Rápido y Eficiente</h3>
              <p className="text-sm text-slate-600 mt-2">
                Accede y gestiona tus productos en segundos con una interfaz intuitiva.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 shadow-md text-center">
              <CheckCircleIcon className="mx-auto h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg">Control Total</h3>
              <p className="text-sm text-slate-600 mt-2">
                Ten el control completo del inventario desde cualquier dispositivo.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 shadow-md text-center">
              <UserGroupIcon className="mx-auto h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg">Multiusuario</h3>
              <p className="text-sm text-slate-600 mt-2">
                Colabora con tu equipo y asigna permisos de acceso fácilmente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="py-16 bg-gradient-to-tr from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-blue-700 mb-2">🎯 Misión</h3>
            <p className="text-sm text-slate-600">
              Proporcionar herramientas digitales de alta calidad para optimizar la gestión de inventarios en organizaciones de todos los tamaños.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-blue-700 mb-2">👁️ Visión</h3>
            <p className="text-sm text-slate-600">
              Ser el sistema de gestión de inventarios más confiable y completo a nivel regional.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-blue-700 mb-2">💼 Valores</h3>
            <p className="text-sm text-slate-600">
              Compromiso, integridad, innovación y enfoque centrado en el usuario.
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
