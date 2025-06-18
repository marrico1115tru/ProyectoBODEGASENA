import { useEffect, useState } from "react";
import {
  getCategoriasProductos,
  createCategoriaProducto,
  updateCategoriaProducto,
  deleteCategoriaProducto,
} from "@/Api/Categorias";
import { CategoriaProducto, CategoriaProductoFormValues } from "@/types/types/categorias";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

export default function CategoriasProductosPage() {
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [formData, setFormData] = useState<CategoriaProductoFormValues>({ nombre: "", unpsc: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const data = await getCategoriasProductos();
    setCategorias(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCategoriaProducto(editingId, formData);
    } else {
      await createCategoriaProducto(formData);
    }
    fetchCategorias();
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (categoria: CategoriaProducto) => {
    setFormData({ nombre: categoria.nombre, unpsc: categoria.unpsc || "" });
    setEditingId(categoria.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteCategoriaProducto(id);
    fetchCategorias();
  };

  const resetForm = () => {
    setFormData({ nombre: "", unpsc: "" });
    setEditingId(null);
  };

  const filtered = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.unpsc || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">📦 Categorías de Productos</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusIcon className="inline-block w-4 h-4 mr-1" /> Crear
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre o UNPSC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">UNPSC</th>
                <th className="px-4 py-2"># Productos</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">No hay categorías registradas.</td>
                </tr>
              ) : (
                paginated.map((cat) => (
                  <tr key={cat.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{cat.id}</td>
                    <td className="px-4 py-2">{cat.nombre}</td>
                    <td className="px-4 py-2">{cat.unpsc || "—"}</td>
                    <td className="px-4 py-2">{cat.productos.length}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline">
                        <PencilIcon className="w-4 h-4 inline-block" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">
                        <TrashIcon className="w-4 h-4 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Editar Categoría" : "Crear Categoría"}
              </h2>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <input
                type="text"
                name="unpsc"
                placeholder="Código UNPSC (opcional)"
                value={formData.unpsc}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />

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
                  className="px-4 py-2 bg-green-600 text-white rounded"
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
