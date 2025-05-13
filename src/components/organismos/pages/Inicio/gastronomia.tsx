import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default'; 

export default function GastronomiaView() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-rose-700 hover:text-rose-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-rose-800 text-center w-full">
              Área de Gastronomía
            </h1>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 space-y-6">
            <p className="text-base md:text-lg text-gray-800">
              La cocina es arte, cultura, ciencia y pasión. En el SENA, el área de <strong>Gastronomía</strong> forma a los nuevos protagonistas del sabor colombiano, capaces de transformar ingredientes en experiencias memorables.
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>Formación en cocina nacional e internacional, panadería, pastelería y repostería.</li>
              <li>Énfasis en higiene, nutrición, maridaje y servicio al cliente.</li>
              <li>Enseñanza basada en técnicas modernas y respeto por el producto local.</li>
              <li>Desarrollo de emprendimientos gastronómicos sostenibles.</li>
            </ul>

            <p className="text-gray-700">
              Cada aprendiz no solo cocina, también aprende a comunicar la identidad culinaria de Colombia, rescatar tradiciones y aportar innovación con criterio profesional.
            </p>

            <div className="bg-rose-100 border-l-4 border-rose-500 p-4 rounded">
              <p className="text-rose-900 font-medium">
                En cada receta se construye una historia. Sé parte de una comunidad donde los sueños se hornean, se sazonan con pasión y se sirven con excelencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
