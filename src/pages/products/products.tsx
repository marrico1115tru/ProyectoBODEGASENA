import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const data = [
    {
      id: 1,
      nombre: "Ordenador",
      descripcion: "Con cargador y ratón",
      categoria: "Máquina digital",
      importe: 2,
      serial: 2367,
    },
    {
      id: 2,
      nombre: "Monitor",
      descripcion: "Pantalla de 27 pulgadas",
      categoria: "Periféricos",
      importe: 5,
      serial: 6543,
    },
    {
      id: 3,
      nombre: "Teclado",
      descripcion: "Mecánico",
      categoria: "Accesorios",
      importe: 10,
      serial: 9876,
    },
  ];

  const filteredData = data.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Título y descripción */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2">Gestión de Productos</h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Aquí puedes ver todos los productos disponibles en la bodega. Puedes buscar productos,
            agregarlos o eliminarlos según sea necesario. Esta sección está diseñada para ayudarte a mantener un control eficiente de los materiales disponibles.
          </p>
        </div>

        {/* Caja contenedora */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          {/* Campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Tabla de productos */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Descripción</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Categoría</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Importe</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-800">Serial</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-blue-800">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredData.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.importe}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{producto.serial}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                      <button className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg shadow transition">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Agregar
                      </button>
                      <button className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow transition">
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mensaje si no hay resultados */}
          {filteredData.length === 0 && (
            <p className="text-center text-gray-500 mt-6">No se encontraron productos.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
