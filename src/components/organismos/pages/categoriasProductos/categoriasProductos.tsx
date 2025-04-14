import { useState } from "react";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const categories = [
  {
    title: "Cleaning Supplies",
    description: "Brooms, mops, soaps",
    image: "/src/img/limpieza (2).jpeg",
  },
  {
    title: "Educational Resources",
    description: "Products from the TIC area",
    image: "/src/img/educacion.jpeg",
  },
  {
    title: "Machine Tools",
    description: "Products from the Agricultural area",
    image: "/src/img/herramientas.jpeg",
  },
  {
    title: "Agricultural inputs",
    description: "Products from the Environmental area",
    image: "/src/img/implementosAgropecuarios.jpeg",
  },
  {
    title: "",
    description: "",
    image: "/images/plants.png",
  },
];

export default function CategoriasProductos() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-[#bdd4e7] p-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-[#204051]">
         INNOVASOFT <span className="font-light"></span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar material"
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
        </div>
      </header>

      {/* Cards */}
      <section className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4 text-center">
              <h3 className="font-bold text-lg">{cat.title}</h3>
              <p className="text-sm text-gray-600">{cat.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-2 text-purple-600 text-sm">
        New shapes!
      </footer>
    </div>
  );
}
