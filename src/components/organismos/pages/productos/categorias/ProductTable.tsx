import { useState } from "react";
import ProductForm from "@/components/organismos/pages/productos/categorias/ProductForm";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  tipo_material: string;
  codigo_sena: string;
  id_categoria: number;
  id_area: number;
}

interface ProductTableProps {
  products: Producto[];
  onDelete: (id: number) => void;
  onUpdate: (producto: Producto) => void;
}

export default function ProductTable({ products, onDelete, onUpdate }: ProductTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
  };

  const handleUpdate = (data: Omit<Producto, "id">) => {
    if (editingId !== null) {
      onUpdate({ id: editingId, ...data });
      setEditingId(null);
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Descripción</th>
            <th className="border px-4 py-2">Cantidad</th>
            <th className="border px-4 py-2">Unidad</th>
            <th className="border px-4 py-2">Código SENA</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((producto) => (
            <tr key={producto.id} className="text-center">
              <td className="border px-4 py-2">{producto.nombre}</td>
              <td className="border px-4 py-2">{producto.descripcion}</td>
              <td className="border px-4 py-2">{producto.cantidad}</td>
              <td className="border px-4 py-2">{producto.unidad_medida}</td>
              <td className="border px-4 py-2">{producto.codigo_sena}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(producto)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(producto.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingId !== null && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Editar producto</h2>
          <ProductForm
            onSubmit={handleUpdate}
            initialData={
              products.find((p) => p.id === editingId) as Omit<Producto, "id">
            }
          />
        </div>
      )}
    </div>
  );
}
