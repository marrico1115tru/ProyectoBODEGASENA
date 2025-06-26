import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
} from "@/Api/Movimientosform";
import { getInventarios } from "@/Api/inventario";
import { obtenerPermisosPorRuta } from "@/Api/PermisosService";
import { Movimiento } from "@/types/types/movimientos";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import {
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const movimientoSchema = z.object({
  tipoMovimiento: z.enum(["ENTRADA", "SALIDA"], {
    errorMap: () => ({ message: "Seleccione tipo" }),
  }),
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });
  const [rol, setRol] = useState<number | null>(null); // 🆕 estado para rol

  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MovimientoForm>({
    resolver: zodResolver(movimientoSchema),
  });

  // 🟡 Cargar idRol desde localStorage
  useEffect(() => {
    const storedRol = localStorage.getItem("idRol");
    if (storedRol) {
      const parsedRol = Number(storedRol);
      setRol(parsedRol);
    } else {
      toast.error("Rol no encontrado en localStorage");
    }
  }, []);

  // 🔵 Obtener permisos usando el rol
  useEffect(() => {
    if (rol) {
      obtenerPermisosPorRuta("/MovimientoInventarioPage", rol)
        .then((res) => {
          setPermisos(res);
          if (res.puedeVer) fetchAll();
        })
        .catch(() => toast.error("Error al obtener permisos"));
    }
  }, [rol]);

  const fetchAll = async () => {
    try {
      const [movs, invs] = await Promise.all([
        getMovimientos(),
        getInventarios(),
      ]);
      setMovimientos(movs);
      setInventarios(invs);
    } catch {
      toast.error("Error al cargar datos");
    }
  };

  const onSubmit = async (data: MovimientoForm) => {
    try {
      const payload = {
        tipoMovimiento: data.tipoMovimiento,
        cantidad: data.cantidad,
        fechaMovimiento: data.fechaMovimiento,
        idProductoInventario: data.idProductoInventario,
      };

      if (editId) {
        // Buscar el inventario correspondiente para obtener el objeto completo
        const inventarioObj = inventarios.find(
          (inv) => inv.idProductoInventario === data.idProductoInventario
        );
        if (!inventarioObj) {
          toast.error("Producto de inventario no encontrado");
          return;
        }
        await updateMovimiento(editId, {
          ...payload,
          id: editId,
          idProductoInventario: inventarioObj,
        });
        toast.success("Movimiento actualizado");
      } else {
        // Buscar el inventario correspondiente para obtener el objeto completo
        const inventarioObj = inventarios.find(
          (inv) => inv.idProductoInventario === data.idProductoInventario
        );
        if (!inventarioObj) {
          toast.error("Producto de inventario no encontrado");
          return;
        }
        await createMovimiento({ ...payload, id: 0, idProductoInventario: inventarioObj });
        toast.success("Movimiento creado");
      }
      reset();
      setShowForm(false);
      setEditId(null);
      fetchAll();
    } catch {
      toast.error("Error al guardar movimiento");
    }
  };

  const handleEdit = (m: Movimiento) => {
    setValue("tipoMovimiento", m.tipoMovimiento as "ENTRADA" | "SALIDA");
    setValue("cantidad", m.cantidad);
    setValue("fechaMovimiento", m.fechaMovimiento);
    setValue("idProductoInventario", m.idProductoInventario.idProductoInventario);
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este movimiento?")) {
      try {
        await deleteMovimiento(id);
        toast.success("Movimiento eliminado");
        fetchAll();
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  const filtered = movimientos.filter((m) =>
    m.idProductoInventario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.idProductoInventario.idProductoInventario.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-10 text-center text-red-600 text-xl font-semibold">
          ❌ No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📦 Movimientos</h1>
          {permisos.puedeCrear && (
            <button
              onClick={() => {
                reset();
                setEditId(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" /> Nuevo
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Buscar producto o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Producto</th>
                {(permisos.puedeEditar || permisos.puedeEliminar) && (
                  <th className="px-4 py-2">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{m.id}</td>
                    <td className="px-4 py-2">{m.tipoMovimiento}</td>
                    <td className="px-4 py-2">{m.cantidad}</td>
                    <td className="px-4 py-2">{m.fechaMovimiento}</td>
                    <td className="px-4 py-2">
                      {m.idProductoInventario.nombre ||
                        `Producto #${m.idProductoInventario.idProductoInventario}`}
                    </td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(m)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="text-red-600 hover:underline"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
              <XMarkIcon
                className="absolute top-3 right-3 w-6 h-6 cursor-pointer text-gray-500"
                onClick={() => setShowForm(false)}
              />
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Editar Movimiento" : "Crear Movimiento"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm">Tipo Movimiento</label>
                  <select
                    {...register("tipoMovimiento")}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Seleccione</option>
                    <option value="ENTRADA">ENTRADA</option>
                    <option value="SALIDA">SALIDA</option>
                  </select>
                  {errors.tipoMovimiento && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.tipoMovimiento.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm">Cantidad</label>
                  <input
                    type="number"
                    {...register("cantidad")}
                    className="w-full border px-3 py-2 rounded"
                  />
                  {errors.cantidad && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.cantidad.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm">Fecha</label>
                  <input
                    type="date"
                    {...register("fechaMovimiento")}
                    className="w-full border px-3 py-2 rounded"
                  />
                  {errors.fechaMovimiento && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.fechaMovimiento.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm">Producto</label>
                  <select
                    {...register("idProductoInventario")}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Seleccione producto</option>
                    {inventarios.map((inv) => (
                      <option
                        key={inv.idProductoInventario}
                        value={inv.idProductoInventario}
                      >
                        {inv.nombre || `Producto ${inv.idProductoInventario}`}
                      </option>
                    ))}
                  </select>
                  {errors.idProductoInventario && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.idProductoInventario.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {editId ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
