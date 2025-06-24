import { useEffect, useState } from "react";
import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
} from "@/Api/Movimientosform";
import { Movimiento } from "@/types/types/movimientos";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const movimientoSchema = z.object({
  tipoMovimiento: z.string().min(1, "Requerido"),
  cantidad: z.coerce.number().positive("Debe ser mayor que 0"),
  fechaMovimiento: z.string().min(1, "Requerido"),
  idProductoInventario: z.object({
    idProductoInventario: z.coerce.number().positive("Selecciona un producto válido"),
  }),
});

type MovimientoForm = z.infer<typeof movimientoSchema>;

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MovimientoForm>({
    resolver: zodResolver(movimientoSchema),
  });

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    const data = await getMovimientos();
    setMovimientos(data);
  };

  const filtered = movimientos.filter((m) =>
    m.tipoMovimiento.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const onSubmit = async (data: MovimientoForm) => {
    try {
      const movimiento: Movimiento = {
        id: editingId || 0,
        ...data,
      };
      if (editingId) {
        await updateMovimiento(editingId, movimiento);
        toast.success("Movimiento actualizado");
      } else {
        await createMovimiento(movimiento);
        toast.success("Movimiento creado");
      }
      setIsModalOpen(false);
      reset();
      setEditingId(null);
      fetchMovimientos();
    } catch (error) {
      toast.error("Error al guardar el movimiento");
    }
  };

  const handleEdit = (mov: Movimiento) => {
    setValue("tipoMovimiento", mov.tipoMovimiento);
    setValue("cantidad", mov.cantidad);
    setValue("fechaMovimiento", mov.fechaMovimiento);
    setValue("idProductoInventario", mov.idProductoInventario);
    setEditingId(mov.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este movimiento?")) {
      await deleteMovimiento(id);
      fetchMovimientos();
      toast.success("Movimiento eliminado");
    }
  };

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📦 Gestión de Movimientos</h1>
          <button
            onClick={() => {
              reset();
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Crear Movimiento
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar movimiento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Cantidad</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="px-6 py-2">{mov.id}</td>
                  <td className="px-6 py-2">{mov.tipoMovimiento}</td>
                  <td className="px-6 py-2">{mov.cantidad}</td>
                  <td className="px-6 py-2">{mov.fechaMovimiento}</td>
                  <td className="px-6 py-2">{mov.idProductoInventario?.nombre || mov.idProductoInventario?.idProductoInventario}</td>
                  <td className="px-6 py-2 flex justify-center gap-2">
                    <button onClick={() => handleEdit(mov)} className="text-yellow-600 hover:text-yellow-800">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(mov.id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Editar Movimiento" : "Crear Movimiento"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Tipo de Movimiento</label>
                <input {...register("tipoMovimiento")} className="w-full border px-3 py-2 rounded" />
                {errors.tipoMovimiento && <p className="text-red-500 text-sm">{errors.tipoMovimiento.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Cantidad</label>
                <input type="number" {...register("cantidad")} className="w-full border px-3 py-2 rounded" />
                {errors.cantidad && <p className="text-red-500 text-sm">{errors.cantidad.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Fecha</label>
                <input type="date" {...register("fechaMovimiento")} className="w-full border px-3 py-2 rounded" />
                {errors.fechaMovimiento && <p className="text-red-500 text-sm">{errors.fechaMovimiento.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">ID del Producto</label>
                <input
                  type="number"
                  {...register("idProductoInventario.idProductoInventario")}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.idProductoInventario?.idProductoInventario && (
                  <p className="text-red-500 text-sm">
                    {errors.idProductoInventario.idProductoInventario.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
