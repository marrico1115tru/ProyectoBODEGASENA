import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

const ProductTable = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Ordenador", description: "Con cargador y ratón", category: "Máquina digital", amount: 2, serial: "2367" },
    { id: 2, name: "Monitor", description: "Pantalla de 27 pulgadas", category: "Periféricos", amount: 5, serial: "6543" },
    { id: 3, name: "Teclado", description: "Mecánico", category: "Accesorios", amount: 10, serial: "9876" },
  ]);

  // Función para aumentar la cantidad del producto
  const handleAdd = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, amount: product.amount + 1 } : product
      )
    );
  };

  //  Función para eliminar un producto
  const handleRemove = (id: number) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  return (
    <div className="p-6">
      {}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Buscar material"
          className="border px-4 py-2 rounded-md w-1/3"
        />
      </div>

      {}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              {["IDENTIFICACIÓN", "Nombre", "Descripción", "Categoría", "Importe", "Serial", "Acciones"].map((header, index) => (
                <th key={index} className="px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.description}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.amount}</td> {}
                <td className="px-4 py-2">{product.serial}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button 
                    className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center hover:bg-green-600"
                    onClick={() => handleAdd(product.id)}
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Agregar
                  </button>
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center hover:bg-red-600"
                    onClick={() => handleRemove(product.id)}
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
