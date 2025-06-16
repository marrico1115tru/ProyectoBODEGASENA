// src/pages/movimientos/MovimientosView.tsx

import { useEffect, useState } from "react";
import {
  getMovimientos,
  deleteMovimiento,
} from "@/Api/Movimientosform";
import { Movimiento } from "@/types/types/movimientos";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export default function MovimientosView() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const data = await getMovimientos();
      setMovimientos(data);
    } catch (error) {
      console.error("Error al obtener movimientos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este movimiento?")) {
      try {
        await deleteMovimiento(id);
        fetchMovimientos();
      } catch (error) {
        console.error("Error al eliminar", error);
      }
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Movimientos</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Movimiento
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Entrega</th>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.id} className="border-t">
                <td className="px-4 py-2">{mov.id}</td>
                <td className="px-4 py-2">{mov.tipoMovimiento}</td>
                <td className="px-4 py-2">{mov.cantidad}</td>
                <td className="px-4 py-2">{mov.fechaMovimiento}</td>
                <td className="px-4 py-2">
                  {typeof mov.idEntrega === "object"
                    ? mov.idEntrega?.observaciones
                    : mov.idEntrega}
                </td>
                <td className="px-4 py-2">
                  {typeof mov.idProductoInventario === "object"
                    ? mov.idProductoInventario?.nombre
                    : mov.idProductoInventario}
                </td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button className="bg-blue-500 text-white p-1 rounded">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(mov.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {movimientos.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No hay movimientos registrados.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
