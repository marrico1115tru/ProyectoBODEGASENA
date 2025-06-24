import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import DefaultLayout from "@/layouts/default";
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
import { CategoriaProducto } from "@/types/types/categorias";

const productoSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  tipoMateria: z.string().optional(),
  fechaVencimiento: z.string().optional(),
  idCategoriaId: z.number().min(1),
});

type ProductoSchema = z.infer<typeof productoSchema>;

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", unpsc: "" });

  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductoSchema>({
    resolver: zodResolver(productoSchema),
  });

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  useEffect(() => {
    const filtered = productos.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase())
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
      if (editId) {
        await updateProducto(editId, data);
        toast.success("Producto actualizado");
      } else {
        await createProducto(data);
        toast.success("Producto creado");
      }
      fetchProductos();
      reset();
      setIsOpen(false);
    } catch {
      toast.error("Error al guardar producto");
    }
  };

  const handleEdit = (prod: Producto) => {
    setValue("nombre", prod.nombre);
    setValue("descripcion", prod.descripcion || "");
    setValue("tipoMateria", prod.tipoMateria || "");
    setValue("fechaVencimiento", prod.fechaVencimiento || "");
    setValue("idCategoriaId", prod.idCategoria?.id || 0);
    setEditId(prod.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este producto?")) {
      await deleteProducto(id);
      fetchProductos();
    }
  };

  const handleCategoriaSubmit = async () => {
    await createCategoriaProducto(nuevaCategoria);
    setNuevaCategoria({ nombre: "", unpsc: "" });
    setIsCategoriaOpen(false);
    fetchCategorias();
    toast.success("Categoría creada");
  };

  const currentData = filteredProductos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📦 Gestión de Productos</h1>
          <button
            onClick={() => {
              reset();
              setEditId(null);
              setIsOpen(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Producto
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold">Descripción</th>
                <th className="px-6 py-3 text-left font-semibold">Tipo</th>
                <th className="px-6 py-3 text-left font-semibold">Vencimiento</th>
                <th className="px-6 py-3 text-left font-semibold">Categoría</th>
                <th className="px-6 py-3 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{p.nombre}</td>
                  <td className="px-6 py-3">{p.descripcion || "—"}</td>
                  <td className="px-6 py-3">{p.tipoMateria || "—"}</td>
                  <td className="px-6 py-3">{p.fechaVencimiento || "—"}</td>
                  <td className="px-6 py-3">{p.idCategoria?.nombre || "—"}</td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-yellow-600 hover:text-yellow-800">
                      <PencilIcon className="w-5 h-5 inline" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-4">No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Siguiente</button>
          </div>
        )}
      </div>

      {/* MODAL DE PRODUCTO */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editId ? "Editar Producto" : "Crear Producto"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register("nombre")} placeholder="Nombre" className="w-full border px-3 py-2 rounded" />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
              <input {...register("descripcion")} placeholder="Descripción" className="w-full border px-3 py-2 rounded" />
              <input {...register("tipoMateria")} placeholder="Tipo" className="w-full border px-3 py-2 rounded" />
              <input type="date" {...register("fechaVencimiento")} className="w-full border px-3 py-2 rounded" />
              <div className="flex gap-2 items-center">
                <select
                  {...register("idCategoriaId", { valueAsNumber: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value={0}>Seleccione una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setIsCategoriaOpen(true)} className="bg-green-600 text-white px-3 rounded">
                  +
                </button>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsOpen(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  {editId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CATEGORÍA */}
      {isCategoriaOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Crear Categoría</h2>
            <input
              placeholder="Nombre"
              value={nuevaCategoria.nombre}
              onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
              className="w-full mb-2 border px-3 py-2 rounded"
            />
            <input
              placeholder="UNPSC"
              value={nuevaCategoria.unpsc}
              onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, unpsc: e.target.value })}
              className="w-full mb-4 border px-3 py-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsCategoriaOpen(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleCategoriaSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
