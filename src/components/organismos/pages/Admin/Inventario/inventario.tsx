// pages/inventario/InventarioPage.tsx
import { useEffect, useState } from "react";
import {
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario,
} from "@/Api/inventario";
import { getProductos } from "@/Api/Productosform";
import { getSitios } from "@/Api/SitioService";
import { Producto } from "@/types/types/typesProductos";
import { Sitio } from "@/types/types/Sitio";
import { Inventario } from "@/types/types/inventario";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const inventarioSchema = z.object({
  stock: z.number().min(1, "Debe ser mayor a 0"),
  fkSitioId: z.number().min(1, "Seleccione un sitio"),
  idProductoId: z.number().min(1, "Seleccione un producto"),
});

type InventarioSchema = z.infer<typeof inventarioSchema>;

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InventarioSchema>({
    resolver: zodResolver(inventarioSchema),
  });

  useEffect(() => {
    fetchInventarios();
    fetchProductos();
    fetchSitios();
  }, []);

  const fetchInventarios = async () => {
    const data = await getInventarios();
    setInventarios(data);
  };

  const fetchProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const fetchSitios = async () => {
    const data = await getSitios();
    setSitios(data);
  };

  const onSubmit = async (data: InventarioSchema) => {
    try {
      if (editingId) {
        await updateInventario(editingId, data);
        toast.success("Inventario actualizado");
      } else {
        await createInventario(data);
        toast.success("Inventario creado");
      }
      fetchInventarios();
      reset();
      setIsModalOpen(false);
    } catch {
      toast.error("Error al guardar inventario");
    }
  };

  const handleEdit = (inv: Inventario) => {
    setValue("stock", inv.stock);
    setValue("fkSitioId", inv.fkSitio.id);
    setValue("idProductoId", inv.idProducto.id);
    setEditingId(inv.idProductoInventario);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este registro?")) {
      await deleteInventario(id);
      fetchInventarios();
    }
  };

  const filtered = inventarios.filter((inv) =>
    inv.idProducto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStockBarColor = (stock: number) => {
    if (stock === 0) return "bg-red-500";
    if (stock <= 10) return "bg-orange-400";
    if (stock <= 50) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getStockPercentage = (stock: number) => {
    return `${Math.min((stock / 100) * 100, 100)}%`;
  };

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📦 Inventario</h1>
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
        </div>

        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Sitio</th>
                <th className="px-4 py-2">Ubicación</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((inv) => (
                  <tr key={inv.idProductoInventario} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{inv.idProducto.nombre}</td>
                    <td className="px-4 py-2">{inv.idProducto.descripcion}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{inv.stock} unidades</span>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getStockBarColor(inv.stock)}`}
                            style={{ width: getStockPercentage(inv.stock) }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{inv.fkSitio.nombre}</td>
                    <td className="px-4 py-2">{inv.fkSitio.ubicacion}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(inv.idProductoInventario)}
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

        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Anterior</button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Siguiente</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Editar Inventario" : "Crear Inventario"}
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
              <label className="block text-sm font-medium">Stock</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Sitio</label>
              <select
                {...register("fkSitioId", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Seleccione un sitio</option>
                {sitios.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
              {errors.fkSitioId && <p className="text-red-500 text-sm">{errors.fkSitioId.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Producto</label>
              <select
                {...register("idProductoId", { valueAsNumber: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              {errors.idProductoId && <p className="text-red-500 text-sm">{errors.idProductoId.message}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >Cancelar</button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              >{editingId ? "Actualizar" : "Crear"}</button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
}
