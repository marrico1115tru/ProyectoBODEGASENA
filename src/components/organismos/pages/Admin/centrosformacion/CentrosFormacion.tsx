import { useEffect, useState } from "react";
import {
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from "@/Api/centrosformacionTable";
import { CentroFormacion } from "@/types/types/typesCentroFormacion";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { obtenerPermisosPorRuta } from "@/Api/PermisosService";

const centroSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  ubicacion: z.string().min(1, "La ubicación es obligatoria"),
  telefono: z.string().min(7, "El teléfono es obligatorio"),
  email: z.string().email("Correo inválido"),
  idMunicipio: z.number().min(1, "Debe seleccionar un municipio"),
});

type CentroFormValues = z.infer<typeof centroSchema>;

export default function CentroFormacionPage() {
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [municipios, setMunicipios] = useState([]);
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
    setValue,
    reset,
    formState: { errors },
  } = useForm<CentroFormValues>({
    resolver: zodResolver(centroSchema),
  });

  useEffect(() => {
    const idRol = Number(localStorage.getItem("idRol"));
    if (!idRol) {
      setLoadingPermisos(false);
      return;
    }

    // ✅ RUTA CORREGIDA
    obtenerPermisosPorRuta("/CentrosFormaciones", idRol)
      .then((res) => {
        setPermisos(res);
      })
      .catch(() => toast.error("Error al obtener permisos"))
      .finally(() => setLoadingPermisos(false));
  }, []);

  useEffect(() => {
    if (permisos.puedeVer) {
      fetchCentros();
      fetchMunicipios();
    }
  }, [permisos]);

  const fetchCentros = async () => {
    const data = await getCentrosFormacion();
    setCentros(data);
  };

  const fetchMunicipios = async () => {
    const res = await axios.get("http://localhost:3000/municipios");
    setMunicipios(res.data);
  };

  const onSubmit = async (data: CentroFormValues) => {
    try {
      const centroData = {
        nombre: data.nombre,
        ubicacion: data.ubicacion,
        telefono: data.telefono,
        email: data.email,
        idMunicipio: { id: data.idMunicipio },
      };

      if (editingId) {
        await updateCentroFormacion(editingId, centroData);
        toast.success("Centro actualizado");
      } else {
        await createCentroFormacion(centroData);
        toast.success("Centro creado");
      }

      fetchCentros();
      reset();
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al guardar el centro");
    }
  };

  const handleEdit = (centro: CentroFormacion) => {
    setValue("nombre", centro.nombre || "");
    setValue("ubicacion", centro.ubicacion || "");
    setValue("telefono", centro.telefono || "");
    setValue("email", centro.email || "");
    setValue("idMunicipio", centro.idMunicipio?.id || 0);
    setEditingId(centro.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este centro?")) {
      await deleteCentroFormacion(id);
      fetchCentros();
      toast.success("Centro eliminado");
    }
  };

  const filtered = centros.filter((c) =>
    (c.nombre ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          <h1 className="text-2xl font-bold">🏫 Centros de Formación</h1>
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
          placeholder="Buscar centro..."
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
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Municipio</th>
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
                paginated.map((centro) => (
                  <tr key={centro.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{centro.id}</td>
                    <td className="px-4 py-2">{centro.nombre}</td>
                    <td className="px-4 py-2">{centro.ubicacion}</td>
                    <td className="px-4 py-2">{centro.telefono}</td>
                    <td className="px-4 py-2">{centro.email}</td>
                    <td className="px-4 py-2">{centro.idMunicipio?.nombre || "Sin municipio"}</td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(centro)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(centro.id)}
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
              {editingId ? "Editar Centro" : "Crear Centro"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium">Nombre</label>
                <input {...register("nombre")} className="w-full border px-3 py-2 rounded" />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Ubicación</label>
                <input {...register("ubicacion")} className="w-full border px-3 py-2 rounded" />
                {errors.ubicacion && <p className="text-red-500 text-sm">{errors.ubicacion.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Teléfono</label>
                <input {...register("telefono")} className="w-full border px-3 py-2 rounded" />
                {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Correo electrónico</label>
                <input {...register("email")} type="email" className="w-full border px-3 py-2 rounded" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Municipio</label>
                <select {...register("idMunicipio", { valueAsNumber: true })} className="w-full border px-3 py-2 rounded">
                  <option value={0}>Seleccione un municipio</option>
                  {municipios.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} - {m.departamento}
                    </option>
                  ))}
                </select>
                {errors.idMunicipio && <p className="text-red-500 text-sm">{errors.idMunicipio.message}</p>}
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
