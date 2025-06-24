import { useEffect, useState } from "react";
import {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
} from "@/Api/AreasService";
import { getSedes } from "@/Api/SedesService";
import { Area } from "@/types/types/typesArea";
import { Sede } from "@/types/types/Sede";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

// Zod schema
const areaSchema = z.object({
  nombreArea: z
    .string()
    .min(1, "El nombre del área es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  idSede: z.object({
    id: z.number().min(1, "Debe seleccionar una sede"),
  }),
});

type AreaFormValues = z.infer<typeof areaSchema>;

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      nombreArea: "",
      idSede: { id: 0 },
    },
  });

  useEffect(() => {
    fetchAreas();
    fetchSedes();
  }, []);

  const fetchAreas = async () => {
    const data = await getAreas();
    setAreas(data);
  };

  const fetchSedes = async () => {
    const data = await getSedes();
    setSedes(data);
  };

  const onSubmit = async (data: AreaFormValues) => {
    try {
      if (editingId) {
        await updateArea(editingId, data);
        toast.success("Área actualizada");
      } else {
        await createArea(data);
        toast.success("Área creada");
      }
      fetchAreas();
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    } catch {
      toast.error("Error al guardar el área");
    }
  };

  const handleEdit = (area: Area) => {
    setEditingId(area.id);
    setValue("nombreArea", area.nombreArea || "");
    setValue("idSede", { id: area.idSede?.id || 0 });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta área?")) {
      await deleteArea(id);
      fetchAreas();
      toast.success("Área eliminada");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = areas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(areas.length / itemsPerPage);

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            🏬 Gestión de Áreas
          </h1>
          <button
            onClick={() => {
              reset();
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Crear
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre del Área</th>
                <th className="px-4 py-2">Sede</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No hay áreas registradas.
                  </td>
                </tr>
              ) : (
                currentItems.map((area) => (
                  <tr key={area.id} className="border-t">
                    <td className="px-4 py-2">{area.id}</td>
                    <td className="px-4 py-2">{area.nombreArea}</td>
                    <td className="px-4 py-2">
                      {area.idSede?.nombre ?? "Sin sede"}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(area)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
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

        {/* Paginación */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded p-6 w-full max-w-md shadow-lg relative"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Editar Área" : "Crear Área"}
              </h2>

              <div className="mb-4">
                <label className="block text-sm mb-1">Nombre del Área</label>
                <input
                  type="text"
                  {...register("nombreArea")}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Ej: Laboratorio de TIC"
                />
                {errors.nombreArea && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.nombreArea.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Sede</label>
                <select
                  {...register("idSede.id", { valueAsNumber: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="0">Seleccione una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
                {errors.idSede?.id && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.idSede.id.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
