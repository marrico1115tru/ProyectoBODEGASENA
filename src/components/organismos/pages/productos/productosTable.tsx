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
    if (editingId) {
      await updateProducto(editingId, data);
    } else {
      await createProducto(data);
    }
    fetchProductos();
    setIsModalOpen(false);
    resetForm();
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
      await deleteProducto(id);
      fetchProductos();
    }
  };

  const handleCreateCategoria = async () => {
    if (!nuevaCategoria.nombre.trim()) return;
    await createCategoriaProducto(nuevaCategoria);
    fetchCategorias();
    setIsCategoriaModalOpen(false);
    setNuevaCategoria({ nombre: "", unpsc: "" });
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
    </DefaultLayout>
  );
}
