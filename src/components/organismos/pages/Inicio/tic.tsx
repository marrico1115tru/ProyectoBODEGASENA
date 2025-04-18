import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TicView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-indigo-700 hover:text-indigo-900"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver
        </button>

        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-indigo-800">
            Tecnologías de la Información y las Comunicaciones (TIC)
          </h1>

          <p className="text-lg text-gray-800">
            En un mundo hiperconectado, el área de <strong>TIC</strong> del SENA forma a los líderes digitales del presente y el futuro. Personas capaces de crear soluciones tecnológicas que impactan y transforman realidades.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Desarrollo de software, bases de datos, diseño web y aplicaciones móviles.</li>
            <li>Infraestructura TI, redes, ciberseguridad y computación en la nube.</li>
            <li>Proyectos de innovación, inteligencia artificial y análisis de datos.</li>
            <li>Conexión con la industria 4.0 y el ecosistema digital nacional.</li>
          </ul>

          <p className="text-gray-700">
            Desde un aula hasta un servidor remoto, los aprendices TIC del SENA se convierten en constructores del cambio digital, aportando a la productividad y la inclusión tecnológica.
          </p>

          <div className="bg-indigo-100 border-l-4 border-indigo-500 p-4 rounded">
            <p className="text-indigo-900 font-medium">
              ¡Imagina, programa, conecta! Tus ideas pueden revolucionar el mundo desde una línea de código.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
