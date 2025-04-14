import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AmbientalView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-green-700 hover:text-green-900"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver
        </button>

        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-green-800">
            Área Ambiental
          </h1>

          <p className="text-lg text-gray-800">
            El área <strong>Ambiental</strong> del SENA forma guardianes del planeta: técnicos y tecnólogos comprometidos con la protección de los recursos naturales y el desarrollo sostenible del país.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Gestión ambiental, residuos, agua, biodiversidad y cambio climático.</li>
            <li>Implementación de sistemas de gestión ambiental en empresas.</li>
            <li>Educación ambiental y participación comunitaria.</li>
            <li>Proyectos de reforestación, conservación y restauración ecológica.</li>
          </ul>

          <p className="text-gray-700">
            En tiempos de crisis climática, nuestros aprendices se preparan para liderar con conciencia, ciencia y acción.
          </p>

          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-900 font-medium">
              Ser ambientalista del SENA es sembrar vida, cuidar el futuro y actuar por un planeta más justo y habitable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
