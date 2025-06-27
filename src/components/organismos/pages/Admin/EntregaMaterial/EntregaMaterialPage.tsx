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
import { EntregaMaterial } from "@/types/types/EntregaMaterial";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

const entregaSchema = z.object({
  fechaEntrega: z.string().min(1, "La fecha es obligatoria"),
  observaciones: z.string().optional(),
  idFichaFormacion: z.object({ id: z.number({ invalid_type_error: "ID inválido" }) }),
  idSolicitud: z.object({ id: z.number({ invalid_type_error: "ID inválido" }) }),
  idUsuarioResponsable: z.object({ id: z.number({ invalid_type_error: "ID inválido" }) }),
});

type EntregaFormData = z.infer<typeof entregaSchema>;

export default function EntregaMaterialPage() {
  const [entregas, setEntregas] = useState<EntregaMaterial[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [fichas, setFichas] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EntregaFormData>({ resolver: zodResolver(entregaSchema) });

  useEffect(() => {
    fetchEntregas();
    fetchDataOptions();
  }, []);

  const fetchEntregas = async () => {
    const data = await getEntregasMaterial();
    setEntregas(data);
  };

  const fetchDataOptions = async () => {
    const [f, s, u] = await Promise.all([
      getFichasFormacion(),
      getSolicitudes(),
      getUsuarios(),
    ]);
    setFichas(f);
    setSolicitudes(s);
    setUsuarios(u);
  };

  const onSubmit = async (data: EntregaFormData) => {
    try {
      if (editId) {
        await updateEntregaMaterial(editId, data);
        toast.success("Entrega actualizada");
      } else {
        await createEntregaMaterial(data);
        toast.success("Entrega creada");
      }
      reset();
      setEditId(null);
      setShowForm(false);
      fetchEntregas();
    } catch {
      toast.error("Error al guardar la entrega");
    }
  };

  const handleEdit = (entrega: EntregaMaterial) => {
    setValue("fechaEntrega", entrega.fechaEntrega);
    setValue("observaciones", entrega.observaciones || "");
    setValue("idFichaFormacion", { id: entrega.idFichaFormacion.id });
    setValue("idSolicitud", { id: entrega.idSolicitud.id });
    setValue("idUsuarioResponsable", { id: entrega.idUsuarioResponsable.id });
    setEditId(entrega.id!);
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("¿Eliminar esta entrega?")) {
      await deleteEntregaMaterial(id);
      fetchEntregas();
      toast.success("Entrega eliminada");
    }
  };

  const filteredEntregas = entregas.filter((entrega) =>
    entrega.idUsuarioResponsable?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEntregas.length / itemsPerPage);
  const paginated = filteredEntregas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📦 Entregas de Material</h1>
          <button
            onClick={() => {
              reset();
              setEditId(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Crear Entrega
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar por nombre responsable..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Fecha</th>
                <th className="px-6 py-3 font-semibold">Observaciones</th>
                <th className="px-6 py-3 font-semibold">Ficha</th>
                <th className="px-6 py-3 font-semibold">Solicitud</th>
                <th className="px-6 py-3 font-semibold">Responsable</th>
                <th className="px-6 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No hay entregas registradas.
                  </td>
                </tr>
              ) : (
                paginated.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-gray-50">
                    <td className="px-6 py-2">{entrega.id}</td>
                    <td className="px-6 py-2">{entrega.fechaEntrega}</td>
                    <td className="px-6 py-2">{entrega.observaciones || "—"}</td>
                    <td className="px-6 py-2">{entrega.idFichaFormacion?.nombre || entrega.idFichaFormacion?.id}</td>
                    <td className="px-6 py-2">{entrega.idSolicitud.id}</td>
                    <td className="px-6 py-2">{entrega.idUsuarioResponsable?.nombre || `ID: ${entrega.idUsuarioResponsable?.id}`}</td>
                    <td className="px-6 py-2 flex justify-center gap-2">
                      <button onClick={() => handleEdit(entrega)} className="text-yellow-600 hover:text-yellow-800">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(entrega.id)} className="text-red-600 hover:text-red-800">
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
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
              <h2 className="text-xl font-bold mb-4">{editId ? "Editar Entrega" : "Crear Entrega"}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Fecha de Entrega</label>
                  <input type="date" {...register("fechaEntrega")} className="w-full border px-3 py-2 rounded" />
                  {errors.fechaEntrega && <p className="text-red-600 text-sm mt-1">{errors.fechaEntrega.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Observaciones</label>
                  <textarea {...register("observaciones")} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Ficha Formación</label>
                  <select onChange={(e) => setValue("idFichaFormacion", { id: Number(e.target.value) })} className="w-full border px-3 py-2 rounded">
                    <option value="">Seleccione una ficha</option>
                    {fichas.map((f) => (
                      <option key={f.id} value={f.id}>{f.nombre}</option>
                    ))}
                  </select>
                  {errors.idFichaFormacion?.id && (
                    <p className="text-red-600 text-sm mt-1">{errors.idFichaFormacion.id.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Solicitud</label>
                  <select onChange={(e) => setValue("idSolicitud", { id: Number(e.target.value) })} className="w-full border px-3 py-2 rounded">
                    <option value="">Seleccione una solicitud</option>
                    {solicitudes.map((s) => (
                      <option key={s.id} value={s.id}>Solicitud #{s.id}</option>
                    ))}
                  </select>
                  {errors.idSolicitud?.id && (
                    <p className="text-red-600 text-sm mt-1">{errors.idSolicitud.id.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Usuario Responsable</label>
                  <select onChange={(e) => setValue("idUsuarioResponsable", { id: Number(e.target.value) })} className="w-full border px-3 py-2 rounded">
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>{u.nombre}</option>
                    ))}
                  </select>
                  {errors.idUsuarioResponsable?.id && (
                    <p className="text-red-600 text-sm mt-1">{errors.idUsuarioResponsable.id.message}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
      </div>
    </DefaultLayout>
  );
}
