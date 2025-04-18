import DefaultLayout from "@/layouts/default";
import { useState } from "react";

export default function NuevaCategoria() {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nueva categoría:", name);
    // Aquí puedes hacer un POST a tu API
  };

  return (
    <DefaultLayout>
      <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar nueva categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Nombre de la categoría
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
