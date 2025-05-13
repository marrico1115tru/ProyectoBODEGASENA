import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default"; 

export default function PaeView() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center w-full">
              Producción Agrícola y Pecuaria (PAE)
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            <p className="text-base md:text-lg text-gray-800">
              La producción agropecuaria es base de la seguridad alimentaria y el
              desarrollo rural. En el SENA, el área <strong>PAE</strong> forma técnicos capaces de
              producir con eficiencia, responsabilidad ambiental y conocimiento del
              campo.
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>Manejo de cultivos y producción pecuaria sostenible.</li>
              <li>Innovación en sistemas agroecológicos y agroindustriales.</li>
              <li>Salud animal, genética, alimentación y bienestar.</li>
              <li>Transformación de productos y acceso a mercados rurales.</li>
            </ul>

            <p className="text-gray-700">
              La formación es práctica, contextualizada y basada en el respeto por la
              tierra, el agua y la vida. Aquí se cultiva el futuro del campo colombiano.
            </p>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-900 font-medium">
                ¡Siembra saber, cosecha futuro! En el SENA, los agropecuarios hacen que
                el campo crezca con técnica, pasión y orgullo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
