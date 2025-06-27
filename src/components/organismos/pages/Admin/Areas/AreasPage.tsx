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
import { obtenerPermisosPorRuta } from "@/Api/PermisosService";

const areaSchema = z.object({
  nombreArea: z
    .string()
    .min(1, "El nombre del área es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  idSedeId: z.number().min(1, "Debe seleccionar una sede"),
});

type AreaFormValues = z.infer<typeof areaSchema>;

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
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
  } = useForm<AreaFormValues>({
    resolver: zodResolver(areaSchema),
  });

  useEffect(() => {
    const idRol = localStorage.getItem("idRol");
    if (idRol) {
      obtenerPermisosPorRuta("/AreasPage", Number(idRol)).then((res) => {
        console.log("🟢 Permisos obtenidos:", res);
        setPermisos(res);
      });
    }
  }, []);

  useEffect(() => {
    if (permisos.puedeVer) {
      fetchAreas();
      fetchSedes();
    }
  }, [permisos]);

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
        await updateArea(editingId, {
          nombreArea: data.nombreArea,
          idSede: { id: data.idSedeId },
        });
        toast.success("Área actualizada");
      } else {
        await createArea({
          nombreArea: data.nombreArea,
          idSede: { id: data.idSedeId },
        });
        toast.success("Área creada");
      }
      fetchAreas();
      reset();
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al guardar el área");
    }
  };

  const handleEdit = (area: Area) => {
    setValue("nombreArea", area.nombreArea || "");
    setValue("idSedeId", area.idSede?.id || 0);
    setEditingId(area.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta área?")) {
      await deleteArea(id);
      fetchAreas();
      toast.success("Área eliminada");
    }
  };

  const filtered = areas.filter((area) =>
    area.nombreArea.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🏬 Áreas</h1>
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
          placeholder="Buscar área..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Sede</th>
                {(permisos.puedeEditar || permisos.puedeEliminar) && (
                  <th className="px-4 py-2">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{area.id}</td>
                    <td className="px-4 py-2">{area.nombreArea}</td>
                    <td className="px-4 py-2">{area.idSede?.nombre ?? "Sin sede"}</td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(area)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(area.id)}
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

      {/* MODAL */}
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
              {editingId ? "Editar Área" : "Crear Área"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium">Nombre del área</label>
                <input
                  {...register("nombreArea")}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.nombreArea && (
                  <p className="text-red-500 text-sm">
                    {errors.nombreArea.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium">Sede</label>
                <select
                  {...register("idSedeId", { valueAsNumber: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value={0}>Seleccione una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
                {errors.idSedeId && (
                  <p className="text-red-500 text-sm">
                    {errors.idSedeId.message}
                  </p>
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
