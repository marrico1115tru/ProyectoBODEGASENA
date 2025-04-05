import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaeView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lime-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-lime-700 hover:text-lime-900"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver
        </button>

        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-lime-800">
            Área de Producción Agrícola y Pecuaria (PAE)
          </h1>

          <p className="text-lg text-gray-800">
            La producción agropecuaria es base de la seguridad alimentaria y el desarrollo rural. En el SENA, el área <strong>PAE</strong> forma técnicos capaces de producir con eficiencia, responsabilidad ambiental y conocimiento del campo.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Manejo de cultivos y producción pecuaria sostenible.</li>
            <li>Innovación en sistemas agroecológicos y agroindustriales.</li>
            <li>Salud animal, genética, alimentación y bienestar.</li>
            <li>Transformación de productos y acceso a mercados rurales.</li>
          </ul>

          <p className="text-gray-700">
            La formación es práctica, contextualizada y basada en el respeto por la tierra, el agua y la vida. Aquí se cultiva el futuro del campo colombiano.
          </p>

          <div className="bg-lime-100 border-l-4 border-lime-500 p-4 rounded">
            <p className="text-lime-900 font-medium">
              ¡Siembra saber, cosecha futuro! En el SENA, los agropecuarios hacen que el campo crezca con técnica, pasión y orgullo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
