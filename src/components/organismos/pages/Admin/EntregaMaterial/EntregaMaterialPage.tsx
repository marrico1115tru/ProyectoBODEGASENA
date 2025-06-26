import { useEffect, useState } from "react";
import {
  getEntregasMaterial,
  createEntregaMaterial,
  updateEntregaMaterial,
  deleteEntregaMaterial,
} from "@/Api/entregaMaterial";
import { getFichasFormacion } from "@/Api/fichasFormacion";
import { getSolicitudes } from "@/Api/Solicitudes";
import { getUsuarios } from "@/Api/Usuariosform";
import { obtenerPermisosPorRuta } from "@/Api/PermisosService";
import { EntregaMaterial } from "@/types/types/EntregaMaterial";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

const entregaSchema = z.object({
  fechaEntrega: z.string().min(1, "La fecha es obligatoria"),
  observaciones: z.string().optional(),
  idFichaFormacion: z.number().min(1, "Seleccione una ficha"),
  idSolicitud: z.number().min(1, "Seleccione una solicitud"),
  idUsuarioResponsable: z.number().min(1, "Seleccione un usuario"),
});

type EntregaFormData = z.infer<typeof entregaSchema>;

export default function EntregaMaterialPage() {
  const [entregas, setEntregas] = useState<EntregaMaterial[]>([]);
  const [fichas, setFichas] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
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

  const [loadingPermisos, setLoadingPermisos] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EntregaFormData>({
    resolver: zodResolver(entregaSchema),
  });

  useEffect(() => {
    const idRol = Number(localStorage.getItem("idRol"));
    if (!idRol) {
      console.warn("⚠️ idRol no encontrado en localStorage");
      setLoadingPermisos(false);
      return;
    }

    obtenerPermisosPorRuta("/EntregaMaterialPage", idRol)
      .then((res) => {
        console.log("🟢 Permisos obtenidos:", res);
        setPermisos(res);
      })
      .catch(() => {
        toast.error("Error al obtener permisos");
      })
      .finally(() => {
        setLoadingPermisos(false);
      });
  }, []);

  useEffect(() => {
    if (permisos.puedeVer) {
      fetchEntregas();
      fetchFichas();
      fetchSolicitudes();
      fetchUsuarios();
    }
  }, [permisos]);

  const fetchEntregas = async () => {
    const data = await getEntregasMaterial();
    setEntregas(data);
  };

  const fetchFichas = async () => {
    const data = await getFichasFormacion();
    setFichas(data);
  };

  const fetchSolicitudes = async () => {
    const data = await getSolicitudes();
    setSolicitudes(data);
  };

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const onSubmit = async (data: EntregaFormData) => {
    try {
      // Transformar los IDs a objetos para cumplir con el tipo EntregaMaterial
      const fichaObj = fichas.find((f) => f.id === data.idFichaFormacion);
      const solicitudObj = solicitudes.find((s) => s.id === data.idSolicitud);
      const usuarioObj = usuarios.find((u) => u.id === data.idUsuarioResponsable);

      const entregaMaterialPayload = {
        ...data,
        idFichaFormacion: fichaObj,
        idSolicitud: solicitudObj,
        idUsuarioResponsable: usuarioObj,
      };

      if (editingId) {
        await updateEntregaMaterial(editingId, entregaMaterialPayload);
        toast.success("Entrega actualizada");
      } else {
        await createEntregaMaterial(entregaMaterialPayload);
        toast.success("Entrega creada");
      }
      fetchEntregas();
      reset();
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al guardar la entrega");
    }
  };

  const handleEdit = (entrega: EntregaMaterial) => {
    setValue("fechaEntrega", entrega.fechaEntrega);
    setValue("observaciones", entrega.observaciones || "");
    setValue("idFichaFormacion", entrega.idFichaFormacion?.id);
    setValue("idSolicitud", entrega.idSolicitud?.id);
    setValue("idUsuarioResponsable", entrega.idUsuarioResponsable?.id);
    setEditingId(entrega.id ?? null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta entrega?")) {
      await deleteEntregaMaterial(id);
      fetchEntregas();
      toast.success("Entrega eliminada");
    }
  };

  const filtered = entregas.filter((entrega) =>
    (entrega.idUsuarioResponsable?.nombre ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loadingPermisos) {
    return (
      <DefaultLayout>
        <div className="p-10 text-center text-gray-600 text-xl font-semibold">
          Cargando permisos...
        </div>
      </DefaultLayout>
    );
  }

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-10 text-center text-red-600 text-xl font-semibold">
           🔒 No tiene permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📦 Entregas de Material</h1>
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
          placeholder="Buscar responsable..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Observaciones</th>
                <th className="px-4 py-2">Ficha</th>
                <th className="px-4 py-2">Solicitud</th>
                <th className="px-4 py-2">Responsable</th>
                {(permisos.puedeEditar || permisos.puedeEliminar) && (
                  <th className="px-4 py-2">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{entrega.id}</td>
                    <td className="px-4 py-2">{entrega.fechaEntrega}</td>
                    <td className="px-4 py-2">{entrega.observaciones ?? "—"}</td>
                    <td className="px-4 py-2">{entrega.idFichaFormacion?.nombre ?? entrega.idFichaFormacion?.id}</td>
                    <td className="px-4 py-2">{entrega.idSolicitud?.id}</td>
                    <td className="px-4 py-2">{entrega.idUsuarioResponsable?.nombre ?? "—"}</td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(entrega)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(entrega.id!)}
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
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
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
              {editingId ? "Editar Entrega" : "Crear Entrega"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium">Fecha de Entrega</label>
                <input
                  type="date"
                  {...register("fechaEntrega")}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.fechaEntrega && (
                  <p className="text-red-500 text-sm">{errors.fechaEntrega.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Observaciones</label>
                <textarea
                  {...register("observaciones")}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Ficha Formación</label>
                <select
                  {...register("idFichaFormacion", { valueAsNumber: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value={0}>Seleccione una ficha</option>
                  {fichas.map((f) => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                  ))}
                </select>
                {errors.idFichaFormacion && (
                  <p className="text-red-500 text-sm">{errors.idFichaFormacion.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Solicitud</label>
                <select
                  {...register("idSolicitud", { valueAsNumber: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value={0}>Seleccione una solicitud</option>
                  {solicitudes.map((s) => (
                    <option key={s.id} value={s.id}>Solicitud #{s.id}</option>
                  ))}
                </select>
                {errors.idSolicitud && (
                  <p className="text-red-500 text-sm">{errors.idSolicitud.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Usuario Responsable</label>
                <select
                  {...register("idUsuarioResponsable", { valueAsNumber: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value={0}>Seleccione un usuario</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>{u.nombre}</option>
                  ))}
                </select>
                {errors.idUsuarioResponsable && (
                  <p className="text-red-500 text-sm">{errors.idUsuarioResponsable.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
