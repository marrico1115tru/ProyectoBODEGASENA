import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";

export default function TicView() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-slate-900 p-6 text-gray-100">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver
          </button>

          <div className="bg-slate-800 shadow-lg rounded-2xl p-8 space-y-6 border border-slate-700">
            <h1 className="text-4xl font-bold text-indigo-300">
              Tecnologías de la Información y las Comunicaciones (TIC)
            </h1>

            <p className="text-lg text-gray-300">
              En un mundo hiperconectado, el área de <strong>TIC</strong> del SENA forma a los líderes
              digitales del presente y el futuro. Personas capaces de crear soluciones tecnológicas que
              impactan y transforman realidades.
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Desarrollo de software, bases de datos, diseño web y aplicaciones móviles.</li>
              <li>Infraestructura TI, redes, ciberseguridad y computación en la nube.</li>
              <li>Proyectos de innovación, inteligencia artificial y análisis de datos.</li>
              <li>Conexión con la industria 4.0 y el ecosistema digital nacional.</li>
            </ul>

            <p className="text-gray-400">
              Desde un aula hasta un servidor remoto, los aprendices TIC del SENA se convierten en
              constructores del cambio digital, aportando a la productividad y la inclusión tecnológica.
            </p>

            <div className="bg-indigo-900/40 border-l-4 border-indigo-500 p-4 rounded">
              <p className="text-indigo-200 font-medium">
                ¡Imagina, programa, conecta! Tus ideas pueden revolucionar el mundo desde una línea de código.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
