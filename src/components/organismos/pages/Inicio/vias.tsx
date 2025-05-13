import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";

export default function ViasView() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-slate-900 p-6 text-gray-100">
        <div className="max-w-4xl mx-auto">
        
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver
          </button>

          
          <div className="bg-slate-800 shadow-lg rounded-2xl p-8 space-y-6 border border-slate-700">
            <h1 className="text-4xl font-bold text-yellow-300">Área de Vías</h1>

            <p className="text-lg text-gray-300">
              En el <strong>SENA</strong>, el área de <strong>Vías</strong> es mucho más que asfalto y
              maquinaria. Es donde se forman los técnicos y tecnólogos que literalmente construyen el futuro
              del país, conectando regiones, personas y oportunidades.
            </p>

            <p className="text-gray-400">
              Este programa está diseñado para que los aprendices se conviertan en expertos en:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Construcción y mantenimiento de carreteras, andenes y vías rurales.</li>
              <li>Lectura e interpretación de planos topográficos y estructurales.</li>
              <li>Normas técnicas de infraestructura vial y seguridad en obra.</li>
              <li>Uso y operación de maquinaria pesada con responsabilidad ambiental.</li>
              <li>Supervisión y control de procesos constructivos.</li>
            </ul>

            <p className="text-gray-400">
              A través de ambientes de formación con tecnología de punta, simuladores y escenarios reales,
              el SENA brinda experiencias prácticas que preparan a los aprendices para enfrentar los desafíos
              del sector vial.
            </p>

            <p className="text-gray-400">
              La formación en esta área no solo mejora la empleabilidad, también promueve el desarrollo
              económico y social, especialmente en territorios que dependen de la infraestructura vial para
              prosperar.
            </p>

            <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-200 font-medium">
                Nuestros aprendices del área de Vías son constructores de caminos, conectores de regiones y
                protagonistas del progreso nacional. ¡Únete y transforma el territorio con tu talento!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
