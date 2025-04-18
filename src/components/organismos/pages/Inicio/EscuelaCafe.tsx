import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CafeView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-amber-700 hover:text-amber-900"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver
        </button>

        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-amber-800">
            Escuela Nacional del Café
          </h1>

          <p className="text-lg text-gray-800">
            Colombia no solo cultiva café. Colombia vive el café. En la <strong>Escuela Nacional del Café</strong> del SENA, cada aprendiz se convierte en guardián de una tradición milenaria, en artesano del sabor y en embajador de un país cafetero por excelencia.
          </p>

          <p className="text-gray-700">
            Nuestra escuela está ubicada en el corazón de la cultura cafetera, y desde allí impulsamos una formación que abarca cada etapa de la cadena productiva:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
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
  );
}
