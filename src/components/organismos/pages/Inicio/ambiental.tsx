import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default'; 

export default function AmbientalView() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-green-700 hover:text-green-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 text-center w-full">
              Área Ambiental
            </h1>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 space-y-6">
            <p className="text-base md:text-lg text-gray-800">
              El área <strong>Ambiental</strong> del SENA forma guardianes del planeta: técnicos y
              tecnólogos comprometidos con la protección de los recursos naturales y el desarrollo
              sostenible del país.
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>Gestión ambiental, residuos, agua, biodiversidad y cambio climático.</li>
              <li>Implementación de sistemas de gestión ambiental en empresas.</li>
              <li>Educación ambiental y participación comunitaria.</li>
              <li>Proyectos de reforestación, conservación y restauración ecológica.</li>
            </ul>

            <p className="text-gray-700">
              En tiempos de crisis climática, nuestros aprendices se preparan para liderar con
              conciencia, ciencia y acción.
            </p>

            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-900 font-medium">
                Ser ambientalista del SENA es sembrar vida, cuidar el futuro y actuar por un planeta
                más justo y habitable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
