import { useEffect, useState } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "@/Api/Productosform";
import {
  getCategoriasProductos,
  createCategoriaProducto,
} from "@/Api/Categorias";
import { Producto } from "@/types/types/typesProductos";
import {
  CategoriaProducto,
  CategoriaProductoFormValues,
} from "@/types/types/categorias";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  tipoMateria: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  idCategoriaId: z.number().min(1, "Seleccione una categoría válida"),
});

type ProductoSchema = z.infer<typeof productoSchema>;

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState<CategoriaProductoFormValues>({ nombre: "", unpsc: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductoSchema>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipoMateria: "",
      fechaVencimiento: "",
      idCategoriaId: 0,
    },
  });

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = productos.filter((p) =>
      p.nombre.toLowerCase().includes(lower) ||
      p.descripcion?.toLowerCase().includes(lower) ||
      p.tipoMateria?.toLowerCase().includes(lower)
    );
    setFilteredProductos(filtered);
    setCurrentPage(1);
  }, [search, productos]);

  const fetchProductos = async () => {
    const data = await getProductos();
    setProductos(data);
    setFilteredProductos(data);
  };

  const fetchCategorias = async () => {
    const data = await getCategoriasProductos();
    setCategorias(data);
  };

  const onSubmit = async (data: ProductoSchema) => {
    try {
      if (editingId) {
        await updateProducto(editingId, data);
        toast.success("Producto actualizado correctamente");
      } else {
        await createProducto(data);
        toast.success("Producto creado correctamente");
      }
      fetchProductos();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
  };

  const handleEdit = (producto: Producto) => {
    setValue("nombre", producto.nombre);
    setValue("descripcion", producto.descripcion || "");
    setValue("tipoMateria", producto.tipoMateria || "");
    setValue("fechaVencimiento", producto.fechaVencimiento || "");
    setValue("idCategoriaId", producto.idCategoria?.id || 0);
    setEditingId(producto.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProducto(id);
        fetchProductos();
        toast.success("Producto eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el producto");
      }
    }
  };

  const handleCreateCategoria = async () => {
    if (!nuevaCategoria.nombre.trim()) return;
    try {
      await createCategoriaProducto(nuevaCategoria);
      fetchCategorias();
      setIsCategoriaModalOpen(false);
      setNuevaCategoria({ nombre: "", unpsc: "" });
      toast.success("Categoría creada correctamente");
    } catch (error) {
      toast.error("Error al crear categoría");
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredProductos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📦 Gestión de Productos</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Crear Producto
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Nombre</th>
                <th className="px-6 py-3 font-semibold">Descripción</th>
                <th className="px-6 py-3 font-semibold">Tipo</th>
                <th className="px-6 py-3 font-semibold">Vencimiento</th>
                <th className="px-6 py-3 font-semibold">Categoría</th>
                <th className="px-6 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                currentData.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50">
                    <td className="px-6 py-2">{prod.nombre}</td>
                    <td className="px-6 py-2">{prod.descripcion || "—"}</td>
                    <td className="px-6 py-2">{prod.tipoMateria || "—"}</td>
                    <td className="px-6 py-2">{prod.fechaVencimiento || "—"}</td>
                    <td className="px-6 py-2">{prod.idCategoria?.nombre || "—"}</td>
                    <td className="px-6 py-2 flex justify-center gap-2">
                      <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-800">
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
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Anterior</button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Siguiente</button>
          </div>
        )}
      </div>

      {/* Modal de producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Editar Producto" : "Crear Producto"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input {...register("nombre")} className="w-full border px-3 py-2 rounded" />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Descripción</label>
                <input {...register("descripcion")} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de Materia</label>
                <input {...register("tipoMateria")} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Fecha de Vencimiento</label>
                <input type="date" {...register("fechaVencimiento")} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Categoría</label>
                <div className="flex gap-2">
                  <select
                    {...register("idCategoriaId", { valueAsNumber: true })}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value={0}>Seleccione una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCategoriaModalOpen(true)}
                    className="bg-green-600 text-white px-3 rounded hover:bg-green-700"
                  >+</button>
                </div>
                {errors.idCategoriaId && <p className="text-red-500 text-sm">{errors.idCategoriaId.message}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de categoría */}
      {isCategoriaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Categoría</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  value={nuevaCategoria.nombre}
                  onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">UNPSC</label>
                <input
                  value={nuevaCategoria.unpsc}
                  onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, unpsc: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsCategoriaModalOpen(false);
                    setNuevaCategoria({ nombre: "", unpsc: "" });
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >Cancelar</button>
                <button
                  onClick={handleCreateCategoria}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
                >Crear</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
