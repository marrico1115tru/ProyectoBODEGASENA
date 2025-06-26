// DetalleSolicitudPage.tsx
import { useEffect, useState } from "react";
import {
  getDetalleSolicitudes,
  createDetalleSolicitud,
  updateDetalleSolicitud,
  deleteDetalleSolicitud,
} from "@/Api/detalles_solicitud";
import { getProductos } from "@/Api/Productosform";
import { getSolicitudes } from "@/Api/Solicitudes";
import { DetalleSolicitud } from "@/types/types/detalles_solicitud";
import { Producto } from "@/types/types/typesProductos";
import { Solicitud } from "@/types/types/Solicitud";
import { obtenerPermisosPorRuta } from "@/Api/PermisosService";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
  cantidadSolicitada: z.coerce
    .number()
    .min(1, "Cantidad mínima es 1"),
  idProductoId: z.number().min(1, "Seleccione un producto"),
  idSolicitudId: z.number().min(1, "Seleccione una solicitud"),
  observaciones: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function DetalleSolicitudPage() {
  const [detalles, setDetalles] = useState<DetalleSolicitud[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const idRol = Number(localStorage.getItem("idRol"));
    obtenerPermisosPorRuta("/DetalleSolicitudPage", idRol)
      .then(setPermisos)
      .catch(() => toast.error("Error al obtener permisos"));
  }, []);

  useEffect(() => {
    if (permisos.puedeVer) {
      fetchAll();
    }
  }, [permisos]);

  const fetchAll = async () => {
    setDetalles(await getDetalleSolicitudes());
    setProductos(await getProductos());
    setSolicitudes(await getSolicitudes());
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      cantidadSolicitada: data.cantidadSolicitada,
      observaciones: data.observaciones || "",
      idProducto: { id: data.idProductoId },
      idSolicitud: { id: data.idSolicitudId },
    };
    try {
      if (editingId) {
        await updateDetalleSolicitud(editingId, payload);
        toast.success("Detalle actualizado");
      } else {
        await createDetalleSolicitud(payload);
        toast.success("Detalle creado");
      }
      fetchAll();
      reset();
      setEditingId(null);
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Error al guardar detalle");
    }
  };

  const handleEdit = (detalle: DetalleSolicitud) => {
    setValue("cantidadSolicitada", detalle.cantidadSolicitada);
    setValue("idProductoId", detalle.idProducto.id);
    setValue("idSolicitudId", detalle.idSolicitud.id);
    setValue("observaciones", detalle.observaciones ?? "");
    setEditingId(detalle.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este detalle?")) {
      await deleteDetalleSolicitud(id);
      fetchAll();
      toast.success("Detalle eliminado");
    }
  };

  const filtered = detalles.filter((d) =>
    d.idProducto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📋 Detalles Solicitud</h1>
          {permisos.puedeCrear && (
            <button
              onClick={() => {
                reset();
                setEditingId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4" /> Crear
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Buscar por producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Solicitud</th>
                <th className="px-4 py-2">Observaciones</th>
                {(permisos.puedeEditar || permisos.puedeEliminar) && <th className="px-4 py-2">Acciones</th>}
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
                paginated.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{d.id}</td>
                    <td className="px-4 py-2">{d.cantidadSolicitada}</td>
                    <td className="px-4 py-2">{d.idProducto.nombre}</td>
                    <td className="px-4 py-2">{d.idSolicitud.id}</td>
                    <td className="px-4 py-2">{d.observaciones}</td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(d)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(d.id)}
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
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Editar Detalle" : "Crear Detalle"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium">Cantidad solicitada</label>
                <input
                  {...register("cantidadSolicitada")}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.cantidadSolicitada && <p className="text-red-500 text-sm">{errors.cantidadSolicitada.message}</p>}
              </div>
              <div>
                <label className="block font-medium">Producto</label>
                <select {...register("idProductoId", { valueAsNumber: true })} className="w-full border px-3 py-2 rounded">
                  <option value={0}>Seleccione un producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                {errors.idProductoId && <p className="text-red-500 text-sm">{errors.idProductoId.message}</p>}
              </div>
              <div>
                <label className="block font-medium">Solicitud</label>
                <select {...register("idSolicitudId", { valueAsNumber: true })} className="w-full border px-3 py-2 rounded">
                  <option value={0}>Seleccione una solicitud</option>
                  {solicitudes.map((s) => (
                    <option key={s.id} value={s.id}>Solicitud #{s.id}</option>
                  ))}
                </select>
                {errors.idSolicitudId && <p className="text-red-500 text-sm">{errors.idSolicitudId.message}</p>}
              </div>
              <div>
                <label className="block font-medium">Observaciones</label>
                <textarea {...register("observaciones")} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
