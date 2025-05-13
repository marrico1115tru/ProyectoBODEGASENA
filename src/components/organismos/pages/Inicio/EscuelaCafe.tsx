import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default'; 

export default function CafeView() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-amber-700 hover:text-amber-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-800 text-center w-full">
              Escuela Nacional del Café
            </h1>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 space-y-6">
            <p className="text-base md:text-lg text-gray-800">
              Colombia no solo cultiva café. Colombia vive el café. En la <strong>Escuela Nacional del Café</strong> del SENA, cada aprendiz se convierte en guardián de una tradición milenaria, en artesano del sabor y en embajador de un país cafetero por excelencia.
            </p>

            <p className="text-gray-700">
              Nuestra escuela está ubicada en el corazón de la cultura cafetera, y desde allí impulsamos una formación que abarca cada etapa de la cadena productiva:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>Producción agrícola sostenible, con técnicas modernas y prácticas ancestrales.</li>
              <li>Procesamiento del grano: fermentación, secado, trilla y tostión de alta calidad.</li>
              <li>Catación profesional y análisis sensorial para evaluar la excelencia del café.</li>
              <li>Barismo, arte latte y preparación especializada para el consumo final.</li>
              <li>Empaque, comercialización y exportación bajo principios de trazabilidad y comercio justo.</li>
            </ul>

            <p className="text-gray-700">
              Más allá de una bebida, el café es una historia, una identidad y una forma de vida que impacta a miles de familias colombianas. En el SENA, los aprendices no solo aprenden de café: viven el café.
            </p>

            <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-amber-900 font-medium">
                Aquí se forman los protagonistas del aroma nacional. Si amas el café, si quieres elevarlo a su máxima expresión, si sueñas con dejar huella en la cultura cafetera, esta es tu escuela.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
