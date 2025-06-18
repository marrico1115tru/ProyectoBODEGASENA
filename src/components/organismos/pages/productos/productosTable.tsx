
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
import {
  Producto,
} from "@/types/types/typesProductos";
import {
  CategoriaProducto,
  CategoriaProductoFormValues,
} from "@/types/types/categorias";
import DefaultLayout from "@/layouts/default";
import { PlusIcon } from "lucide-react";
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
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState<CategoriaProductoFormValues>({
    nombre: "",
    unpsc: "",
  });

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

  const fetchProductos = async () => {
    const data = await getProductos();
    setProductos(data);
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
    setValue("idCategoriaId", producto.idCategoria.id);
    setEditingId(producto.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteProducto(id);
    fetchProductos();
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

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">📋 Productos</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusIcon className="inline-block w-4 h-4 mr-1" />
            Crear
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Vencimiento</th>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.id} className="border-t">
                    <td className="px-4 py-2">{prod.nombre}</td>
                    <td className="px-4 py-2">{prod.descripcion}</td>
                    <td className="px-4 py-2">{prod.tipoMateria}</td>
                    <td className="px-4 py-2">{prod.fechaVencimiento || "—"}</td>
                    <td className="px-4 py-2">{prod.idCategoria?.nombre || "—"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
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

        {/* Modal Producto */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded p-6 w-full max-w-md shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Editar Producto" : "Crear Producto"}
              </h2>

              <input
                type="text"
                placeholder="Nombre"
                {...register("nombre")}
                className="w-full mb-1 p-2 border rounded"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mb-2">{errors.nombre.message}</p>
              )}

              <input
                type="text"
                placeholder="Descripción"
                {...register("descripcion")}
                className="w-full mb-4 p-2 border rounded"
              />

              <input
                type="text"
                placeholder="Tipo de materia"
                {...register("tipoMateria")}
                className="w-full mb-4 p-2 border rounded"
              />

              <input
                type="date"
                {...register("fechaVencimiento")}
                className="w-full mb-4 p-2 border rounded"
              />

              <div className="flex items-center mb-4 gap-2">
                <select
                  {...register("idCategoriaId", { valueAsNumber: true })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCategoriaModalOpen(true)}
                  className="bg-green-600 text-white px-2 py-2 rounded hover:bg-green-700"
                  title="Agregar nueva categoría"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              {errors.idCategoriaId && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.idCategoriaId.message}
                </p>
              )}

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

        {/* Modal Crear Categoría */}
        {isCategoriaModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Crear Categoría</h2>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la categoría"
                value={nuevaCategoria.nombre}
                onChange={(e) =>
                  setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="unpsc"
                placeholder="Código UNPSC (opcional)"
                value={nuevaCategoria.unpsc || ""}
                onChange={(e) =>
                  setNuevaCategoria({ ...nuevaCategoria, unpsc: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoriaModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateCategoria}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
