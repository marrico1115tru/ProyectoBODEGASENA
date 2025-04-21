// src/pages/CategoriasView.tsx
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";

const categorias = [
  { nombre: "Limpieza", icono: "🧼" },
  { nombre: "Agropecuario", icono: "🌿" },
  { nombre: "Ambiental", icono: "🌎" },
  { nombre: "Gastronomía", icono: "🍽️" },
  { nombre: "Vías", icono: "🛣️" },
  { nombre: "TIC", icono: "💻" },
  { nombre: "Escuela del Café", icono: "☕" },
];

export default function CategoriasView() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📁 Categorías</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <div
              key={cat.nombre}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              onClick={() => navigate(`/categoria/${cat.nombre}`)}
            >
              <div className="text-4xl mb-2">{cat.icono}</div>
              <h2 className="text-xl font-semibold">{cat.nombre}</h2>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
