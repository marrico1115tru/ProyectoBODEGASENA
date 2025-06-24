// pages/solicitudes/SolicitudesPage.tsx
import { useEffect, useState } from "react";
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from "@/Api/Solicitudes";
import { getUsuarios } from "@/Api/Usuariosform";
import { Solicitud, SolicitudPayload } from "@/types/types/Solicitud";
import { Usuario } from "@/types/types/Usuario";
import DefaultLayout from "@/layouts/default";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

// ✅ Validaciones Zod
const schema = z.object({
  fechaSolicitud: z
    .string()
    .min(1, "La fecha es obligatoria")
    .refine((fecha) => !isNaN(Date.parse(fecha)), {
      message: "La fecha no es válida",
    }),
  estadoSolicitud: z.enum(["PENDIENTE", "APROBADA", "RECHAZADA"], {
    errorMap: () => ({ message: "Seleccione un estado válido" }),
  }),
  idUsuarioSolicitanteId: z
    .coerce.number({
      invalid_type_error: "Debe seleccionar un usuario",
    })
    .min(1, "Seleccione un usuario"),
});

type FormSchema = z.infer<typeof schema>;

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      fechaSolicitud: "",
      estadoSolicitud: "PENDIENTE",
      idUsuarioSolicitanteId: 0,
    },
  });

  useEffect(() => {
    fetchSolicitudes();
    fetchUsuarios();
  }, []);

  const fetchSolicitudes = async () => {
    const data = await getSolicitudes();
    setSolicitudes(data);
  };

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const onSubmit = async (data: FormSchema) => {
    const payload: SolicitudPayload = {
      fechaSolicitud: data.fechaSolicitud,
      estadoSolicitud: data.estadoSolicitud,
      idUsuarioSolicitante: { id: data.idUsuarioSolicitanteId },
    };

    try {
      if (editId) {
        await updateSolicitud(editId, payload);
        toast.success("Solicitud actualizada");
      } else {
        await createSolicitud(payload);
        toast.success("Solicitud creada");
      }
      setIsModalOpen(false);
      reset();
      setEditId(null);
      fetchSolicitudes();
    } catch {
      toast.error("Error al guardar la solicitud");
    }
  };

  const handleEdit = (sol: Solicitud) => {
    setValue("fechaSolicitud", sol.fechaSolicitud);
    setValue("estadoSolicitud", sol.estadoSolicitud);
    setValue("idUsuarioSolicitanteId", sol.idUsuarioSolicitante.id);
    setEditId(sol.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta solicitud?")) {
      await deleteSolicitud(id);
      fetchSolicitudes();
    }
  };

  const filtered = solicitudes.filter((s) =>
    s.idUsuarioSolicitante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📄 Solicitudes</h1>
          <button
            onClick={() => {
              reset();
              setEditId(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Crear Solicitud
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar por nombre del solicitante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Fecha</th>
                <th className="px-6 py-3 font-semibold">Estado</th>
                <th className="px-6 py-3 font-semibold">Solicitante</th>
                <th className="px-6 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No hay solicitudes registradas.
                  </td>
                </tr>
              ) : (
                paginated.map((sol) => (
                  <tr key={sol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-2">{sol.id}</td>
                    <td className="px-6 py-2">{sol.fechaSolicitud}</td>
                    <td className="px-6 py-2">{sol.estadoSolicitud}</td>
                    <td className="px-6 py-2">
                      {sol.idUsuarioSolicitante
                        ? `${sol.idUsuarioSolicitante.nombre} ${sol.idUsuarioSolicitante.apellido}`
                        : "Sin solicitante"}
                    </td>
                    <td className="px-6 py-2 flex justify-center gap-2">
                      <button onClick={() => handleEdit(sol)} className="text-yellow-600 hover:text-yellow-800">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(sol.id)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Editar Solicitud" : "Crear Solicitud"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  {...register("fechaSolicitud")}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.fechaSolicitud ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fechaSolicitud && (
                  <p className="text-red-500 text-sm mt-1">{errors.fechaSolicitud.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Estado</label>
                <select
                  {...register("estadoSolicitud")}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.estadoSolicitud ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccione un estado</option>
                  {["PENDIENTE", "APROBADA", "RECHAZADA"].map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
                {errors.estadoSolicitud && (
                  <p className="text-red-500 text-sm mt-1">{errors.estadoSolicitud.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Solicitante</label>
                <select
                  {...register("idUsuarioSolicitanteId")}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.idUsuarioSolicitanteId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} {u.apellido}
                    </option>
                  ))}
                </select>
                {errors.idUsuarioSolicitanteId && (
                  <p className="text-red-500 text-sm mt-1">{errors.idUsuarioSolicitanteId.message}</p>
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
                  {editId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
