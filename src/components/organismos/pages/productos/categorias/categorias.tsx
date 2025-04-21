// src/pages/Categorias.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/categoria")
      .then((res) => res.json())
      .then(setCategorias)
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">🗂 Categorías</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/productos/${cat.nombre}`)}
              className="cursor-pointer p-4 rounded-xl bg-blue-100 hover:bg-blue-200 shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{cat.nombre}</h2>
              <p className="text-sm text-gray-700">{cat.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
