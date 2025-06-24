// pages/sedes/SedesPage.tsx
import { useEffect, useState } from "react";
import {
  getSedes,
  createSede,
  updateSede,
  deleteSede,
} from "@/Api/SedesService";
import { getCentrosFormacion } from "@/Api/centrosformacionTable";
import { Sede } from "@/types/types/Sede";
import { CentroFormacion } from "@/types/types/typesCentroFormacion";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const sedeSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  ubicacion: z.string().min(1, "Ubicación requerida"),
  idCentroFormacion: z.object({
    id: z.number().min(1, "Seleccione un centro de formación"),
  }),
});

type FormData = z.infer<typeof sedeSchema>;

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(sedeSchema) });

  useEffect(() => {
    fetchSedes();
    fetchCentros();
  }, []);

  const fetchSedes = async () => {
    const data = await getSedes();
    setSedes(data);
  };

  const fetchCentros = async () => {
    const data = await getCentrosFormacion();
    setCentros(data);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await updateSede(editingId, data);
        toast.success("Sede actualizada");
      } else {
        await createSede(data);
        toast.success("Sede creada");
      }
      fetchSedes();
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    } catch {
      toast.error("Error al guardar la sede");
    }
  };

  const handleEdit = (sede: Sede) => {
    setValue("nombre", sede.nombre);
    setValue("ubicacion", sede.ubicacion);
    setValue("idCentroFormacion.id", sede.idCentroFormacion?.id ?? 0);
    setEditingId(sede.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta sede?")) {
      await deleteSede(id);
      fetchSedes();
      toast.success("Sede eliminada");
    }
  };

  const filtered = sedes.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🏢 Gestión de Sedes</h1>
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
        </div>

        <input
          type="text"
          placeholder="Buscar sede..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Ubicación</th>
                <th className="px-4 py-2">Centro Formación</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                currentItems.map((sede) => (
                  <tr key={sede.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2">{sede.id}</td>
                    <td className="px-4 py-2">{sede.nombre}</td>
                    <td className="px-4 py-2">{sede.ubicacion}</td>
                    <td className="px-4 py-2">
                      {sede.idCentroFormacion?.nombre ?? "Sin centro"}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(sede)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(sede.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Editar Sede" : "Crear Sede"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                {...register("nombre")}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">{errors.nombre.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Ubicación</label>
              <input
                type="text"
                {...register("ubicacion")}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.ubicacion && (
                <p className="text-red-500 text-sm">{errors.ubicacion.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Centro de Formación
              </label>
              <select
                {...register("idCentroFormacion.id", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Seleccione un centro</option>
                {centros.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errors.idCentroFormacion?.id && (
                <p className="text-red-500 text-sm">
                  {errors.idCentroFormacion.id.message}
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
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              >
                {editingId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
}
