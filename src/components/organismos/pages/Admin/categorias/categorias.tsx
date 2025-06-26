import { useEffect, useState } from "react";
import {
  getCategoriasProductos,
  createCategoriaProducto,
  updateCategoriaProducto,
  deleteCategoriaProducto,
} from "@/Api/Categorias";
import { CategoriaProducto } from "@/types/types/categorias";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  unpsc: z.string().optional(),
});

type CategoriaSchema = z.infer<typeof categoriaSchema>;

export default function CategoriasProductosPage() {
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoriaSchema>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { nombre: "", unpsc: "" },
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const data = await getCategoriasProductos();
    setCategorias(data);
  };

  const filtered = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.unpsc || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const onSubmit = async (data: CategoriaSchema) => {
    try {
      if (editingId) {
        await updateCategoriaProducto(editingId, data);
        toast.success("Categoría actualizada");
      } else {
        await createCategoriaProducto(data);
        toast.success("Categoría creada");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategorias();
    } catch (error) {
      toast.error("Error al guardar la categoría");
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
  };

  const handleEdit = (cat: CategoriaProducto) => {
    setValue("nombre", cat.nombre);
    setValue("unpsc", cat.unpsc || "");
    setEditingId(cat.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await deleteCategoriaProducto(id);
        fetchCategorias();
        toast.success("Categoría eliminada");
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🏷️ Categorías de Productos</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Crear Categoría
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar categoría o UNPSC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Nombre</th>
                <th className="px-6 py-3 font-semibold">UNPSC</th>
                <th className="px-6 py-3 font-semibold"># Productos</th>
                <th className="px-6 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : (
                paginated.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-2">{cat.id}</td>
                    <td className="px-6 py-2">{cat.nombre}</td>
                    <td className="px-6 py-2">{cat.unpsc || "—"}</td>
                    <td className="px-6 py-2">{cat.productos?.length || 0}</td>
                    <td className="px-6 py-2 flex justify-center gap-2">
                      <button onClick={() => handleEdit(cat)} className="text-yellow-600 hover:text-yellow-800">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800">
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
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Editar Categoría" : "Crear Categoría"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  {...register("nombre")}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">UNPSC</label>
                <input
                  {...register("unpsc")}
                  className="w-full border px-3 py-2 rounded"
                />
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
        </div>
      )}
    </DefaultLayout>
  );
}
