import { useEffect, useState } from "react";
import {
  getFichasFormacion,
  createFichaFormacion,
  updateFichaFormacion,
  deleteFichaFormacion,
} from "@/Api/fichasFormacion";
import { getTitulados } from "@/Api/TituladosService";
import { getUsuarios } from "@/Api/Usuariosform";
import { obtenerPermisosPorRuta } from "@/Api/PermisosService";
import { FichaFormacion } from "@/types/types/FichaFormacion";
import { Titulados } from "@/types/types/typesTitulados";
import { Usuario } from "@/types/types/Usuario";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const fichaSchema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio"),
  idTitulado: z.number().min(1, "Seleccione un titulado"),
  idUsuarioResponsable: z.number().min(1, "Seleccione un responsable"),
});

type FichaSchema = z.infer<typeof fichaSchema>;

export default function FichasFormacionPage() {
  const [fichas, setFichas] = useState<FichaFormacion[]>([]);
  const [titulados, setTitulados] = useState<Titulados[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPermisos, setLoadingPermisos] = useState(true);
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
    reset,
    setValue,
    formState: { errors },
  } = useForm<FichaSchema>({ resolver: zodResolver(fichaSchema) });

  useEffect(() => {
    const idRol = Number(localStorage.getItem("idRol"));
    console.log("🔧 DEBUG idRol:", idRol);

    if (!idRol) {
      toast.error("ID de rol no encontrado");
      setLoadingPermisos(false);
      return;
    }

    obtenerPermisosPorRuta("/FichaFormacionPage", idRol)
      .then((res) => {
        console.log("🔧 DEBUG permisos retornados:", res);
        setPermisos({
          puedeVer: res.puedeVer ?? false,
          puedeCrear: res.puedeCrear ?? false,
          puedeEditar: res.puedeEditar ?? false,
          puedeEliminar: res.puedeEliminar ?? false,
        });
      })
      .catch((error) => {
        toast.error("Error al obtener permisos");
        console.error("🔴 Error de permisos:", error);
      })
      .finally(() => setLoadingPermisos(false));
  }, []);

  useEffect(() => {
    if (permisos.puedeVer) {
      fetchAllData();
    }
  }, [permisos]);

  const fetchAllData = async () => {
    try {
      const [fichasData, tituladosData, usuariosData] = await Promise.all([
        getFichasFormacion(),
        getTitulados(),
        getUsuarios(),
      ]);
      setFichas(fichasData);
      setTitulados(tituladosData);
      setUsuarios(usuariosData);
    } catch (error) {
      toast.error("Error al cargar datos");
    }
  };

  const onSubmit = async (data: FichaSchema) => {
    try {
      if (editingId) {
        await updateFichaFormacion(editingId, data);
        toast.success("Ficha actualizada");
      } else {
        await createFichaFormacion(data);
        toast.success("Ficha creada");
      }
      fetchAllData();
      reset();
      setIsModalOpen(false);
      setEditingId(null);
    } catch (err) {
      toast.error("Error al guardar ficha");
    }
  };

  const handleEdit = (ficha: FichaFormacion) => {
    setValue("nombre", ficha.nombre);
    setValue("idTitulado", ficha.idTitulado?.id || 0);
    setValue("idUsuarioResponsable", ficha.idUsuarioResponsable?.id || 0);
    setEditingId(ficha.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta ficha de formación?")) {
      try {
        await deleteFichaFormacion(id);
        toast.success("Ficha eliminada");
        fetchAllData();
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  const handleCloseModal = () => {
    reset();
    setIsModalOpen(false);
    setEditingId(null);
  };

  const filtered = fichas.filter((f) =>
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold">📘 Fichas de Formación</h1>
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
          placeholder="Buscar ficha..."
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
                <th className="px-4 py-2">Titulado</th>
                <th className="px-4 py-2">Responsable</th>
                {(permisos.puedeEditar || permisos.puedeEliminar) && (
                  <th className="px-4 py-2">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((ficha) => (
                  <tr key={ficha.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{ficha.id}</td>
                    <td className="px-4 py-2">{ficha.nombre}</td>
                    <td className="px-4 py-2">{ficha.idTitulado?.nombre}</td>
                    <td className="px-4 py-2">
                      {ficha.idUsuarioResponsable
                        ? `${ficha.idUsuarioResponsable.nombre} ${ficha.idUsuarioResponsable.apellido}`
                        : "Sin responsable"}
                    </td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(ficha)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(ficha.id)}
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
                {editingId ? "Editar Ficha" : "Crear Ficha"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
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
              <label className="block text-sm font-medium">Titulado</label>
              <select
                {...register("idTitulado", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Seleccione un titulado</option>
                {titulados.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              {errors.idTitulado && (
                <p className="text-red-500 text-sm">
                  {errors.idTitulado.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Responsable</label>
              <select
                {...register("idUsuarioResponsable", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Seleccione un usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido}
                  </option>
                ))}
              </select>
              {errors.idUsuarioResponsable && (
                <p className="text-red-500 text-sm">
                  {errors.idUsuarioResponsable.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
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
