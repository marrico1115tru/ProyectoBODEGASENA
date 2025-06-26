import { useEffect, useState } from "react";
import {
  getSitios,
  createSitio,
  updateSitio,
  deleteSitio,
} from "@/Api/SitioService";
import { getAreas } from "@/Api/AreasService";
import { getTiposSitio } from "@/Api/Tipo_sitios";
import { obtenerPermisosPorRuta } from "@/Api/PermisosService";
import { Sitio, SitioFormValues } from "@/types/types/Sitio";
import { Area } from "@/types/types/typesArea";
import { TipoSitio } from "@/types/types/tipo_sitios";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

const sitioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  ubicacion: z.string().min(1, "La ubicación es obligatoria").max(150),
  idArea: z.object({ id: z.number().min(1, "Seleccione un área") }),
  idTipoSitio: z.object({ id: z.number().min(1, "Seleccione un tipo de sitio") }),
});

export default function SitiosPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tiposSitio, setTiposSitio] = useState<TipoSitio[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SitioFormValues>({
    resolver: zodResolver(sitioSchema),
  });

  useEffect(() => {
    const rol = localStorage.getItem("idRol");
    if (rol) {
      obtenerPermisosPorRuta("/SitiosPage", Number(rol)).then((perms) => {
        setPermisos(perms);
        if (perms.puedeVer) {
          fetchData();
        }
      });
    }
  }, []);

  const fetchData = async () => {
    try {
      const [sitiosData, areasData, tiposData] = await Promise.all([
        getSitios(),
        getAreas(),
        getTiposSitio(),
      ]);
      setSitios(sitiosData);
      setAreas(areasData);
      setTiposSitio(tiposData);
    } catch {
      toast.error("Error cargando datos");
    }
  };

  const onSubmit = async (data: SitioFormValues) => {
    try {
      if (editingId) {
        await updateSitio(editingId, data);
        toast.success("Sitio actualizado");
      } else {
        await createSitio(data);
        toast.success("Sitio creado");
      }
      fetchData();
      reset();
      setIsModalOpen(false);
      setEditingId(null);
    } catch {
      toast.error("Error al guardar el sitio");
    }
  };

  const handleEdit = (sitio: Sitio) => {
    setEditingId(sitio.id);
    setValue("nombre", sitio.nombre ?? "");
    setValue("ubicacion", sitio.ubicacion ?? "");
    setValue("idArea.id", sitio.idArea?.id ?? 0);
    setValue("idTipoSitio.id", sitio.idTipoSitio?.id ?? 0);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este sitio?")) {
      await deleteSitio(id);
      toast.success("Sitio eliminado");
      fetchData();
    }
  };

  const filteredSitios = sitios.filter((s) =>
    (s.nombre ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSitios.length / itemsPerPage);
  const currentItems = filteredSitios.slice(
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
          <h1 className="text-2xl font-bold">📍 Gestión de Sitios</h1>
          {permisos.puedeCrear && (
            <button
              onClick={() => {
                reset();
                setEditingId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <PlusIcon className="w-4 h-4" /> Crear
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Buscar sitio..."
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
                <th className="px-4 py-2">Ubicación</th>
                <th className="px-4 py-2">Área</th>
                <th className="px-4 py-2">Tipo de Sitio</th>
                {(permisos.puedeEditar || permisos.puedeEliminar) && (
                  <th className="px-4 py-2">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                currentItems.map((sitio) => (
                  <tr key={sitio.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2">{sitio.id}</td>
                    <td className="px-4 py-2">{sitio.nombre}</td>
                    <td className="px-4 py-2">{sitio.ubicacion}</td>
                    <td className="px-4 py-2">
                      {sitio.idArea?.nombre ?? "Sin área"}
                    </td>
                    <td className="px-4 py-2">
                      {sitio.idTipoSitio?.nombre ?? "Sin tipo"}
                    </td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(sitio)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(sitio.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Editar Sitio" : "Crear Sitio"}
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
              <label className="block text-sm font-medium">Área</label>
              <select
                {...register("idArea.id", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Seleccione un área</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
              {errors.idArea?.id && (
                <p className="text-red-500 text-sm">
                  {errors.idArea.id.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Tipo de Sitio</label>
              <select
                {...register("idTipoSitio.id", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Seleccione un tipo</option>
                {tiposSitio.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              {errors.idTipoSitio?.id && (
                <p className="text-red-500 text-sm">
                  {errors.idTipoSitio.id.message}
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
      )}
    </DefaultLayout>
  );
}
