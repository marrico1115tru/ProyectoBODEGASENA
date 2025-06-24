// src/pages/MovimientosPage.tsx
import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
} from "@/Api/Movimientosform";
import { getInventarios } from "@/Api/inventario";
import { Movimiento } from "@/types/types/movimientos";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const movimientoSchema = z.object({
  tipoMovimiento: z.enum(["ENTRADA", "SALIDA"], { errorMap: () => ({ message: "Seleccione tipo" }) }),
  cantidad: z.coerce.number().min(1, "Cantidad debe ser mayor que cero"),
  fechaMovimiento: z.string().min(1, "Fecha obligatoria"),
  idProductoInventario: z.coerce.number().min(1, "Seleccione un producto"),
});

type MovimientoForm = z.infer<typeof movimientoSchema>;

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<MovimientoForm>({ resolver: zodResolver(movimientoSchema) });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [movs, invs] = await Promise.all([getMovimientos(), getInventarios()]);
    setMovimientos(movs);
    setInventarios(invs);
  };

  const onSubmit = async (data: MovimientoForm) => {
    const payload = {
      tipoMovimiento: data.tipoMovimiento,
      cantidad: data.cantidad,
      fechaMovimiento: data.fechaMovimiento,
      idProductoInventario: { idProductoInventario: data.idProductoInventario },
    };

    try {
      if (editId) {
        await updateMovimiento(editId, payload);
        toast.success("Movimiento actualizado");
      } else {
        await createMovimiento(payload);
        toast.success("Movimiento creado");
      }
      reset();
      setShowForm(false);
      setEditId(null);
      fetchAll();
    } catch {
      toast.error("Error al guardar");
    }
  };

  const handleEdit = (m: Movimiento) => {
    setValue("tipoMovimiento", m.tipoMovimiento);
    setValue("cantidad", m.cantidad);
    setValue("fechaMovimiento", m.fechaMovimiento);
    setValue("idProductoInventario", m.idProductoInventario.idProductoInventario);
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este movimiento?")) {
      await deleteMovimiento(id);
      toast.success("Movimiento eliminado");
      fetchAll();
    }
  };

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📦 Movimientos</h1>
          <button
            onClick={() => { reset(); setEditId(null); setShowForm(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Nuevo
          </button>
        </div>

        <table className="min-w-full text-sm bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-2">{m.id}</td>
                <td className="px-4 py-2">{m.tipoMovimiento}</td>
                <td className="px-4 py-2">{m.cantidad}</td>
                <td className="px-4 py-2">{m.fechaMovimiento}</td>
                <td className="px-4 py-2">{m.idProductoInventario.nombre || m.idProductoInventario.idProductoInventario}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleEdit(m)} className="text-yellow-600 hover:text-yellow-800">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
              <XMarkIcon
                className="absolute top-3 right-3 w-6 h-6 cursor-pointer text-gray-500"
                onClick={() => setShowForm(false)}
              />
              <h2 className="text-xl font-bold mb-4">{editId ? "Editar Movimiento" : "Crear Movimiento"}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm">Tipo Movimiento</label>
                  <select {...register("tipoMovimiento")} className="w-full border px-3 py-2 rounded">
                    <option value="">Seleccione</option>
                    <option value="ENTRADA">ENTRADA</option>
                    <option value="SALIDA">SALIDA</option>
                  </select>
                  {errors.tipoMovimiento && <p className="text-red-600 text-sm mt-1">{errors.tipoMovimiento.message}</p>}
                </div>
                <div>
                  <label className="block text-sm">Cantidad</label>
                  <input type="number" {...register("cantidad")} className="w-full border px-3 py-2 rounded" />
                  {errors.cantidad && <p className="text-red-600 text-sm mt-1">{errors.cantidad.message}</p>}
                </div>
                <div>
                  <label className="block text-sm">Fecha</label>
                  <input type="date" {...register("fechaMovimiento")} className="w-full border px-3 py-2 rounded" />
                  {errors.fechaMovimiento && <p className="text-red-600 text-sm mt-1">{errors.fechaMovimiento.message}</p>}
                </div>
                <div>
                  <label className="block text-sm">Producto</label>
                  <select {...register("idProductoInventario")} className="w-full border px-3 py-2 rounded">
                    <option value="">Seleccione producto</option>
                    {inventarios.map((inv) => (
                      <option key={inv.idProductoInventario} value={inv.idProductoInventario}>
                        {inv.nombre || inv.idProductoInventario}
                      </option>
                    ))}
                  </select>
                  {errors.idProductoInventario && <p className="text-red-600 text-sm mt-1">{errors.idProductoInventario.message}</p>}
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editId ? "Actualizar" : "Crear"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
