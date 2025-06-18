// ✅ Versión mejorada: colores suaves, búsqueda reactiva, paginación y modal elegante

import { useEffect, useState } from "react";
import {
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario,
} from "@/Api/inventario";
import { Inventario, InventarioFormValues } from "@/types/types/inventario";
import { getProductos } from "@/Api/Productosform";
import { getSitios } from "@/Api/SitioService";
import { Producto } from "@/types/types/typesProductos";
import { Sitio } from "@/types/types/Sitio";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [formData, setFormData] = useState<InventarioFormValues>({
    stock: 0,
    fkSitioId: 0,
    idProductoId: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) || value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateInventario(editingId, formData);
    } else {
      await createInventario(formData);
    }
    fetchInventarios();
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (inv: Inventario) => {
    setFormData({
      stock: inv.stock,
      fkSitioId: inv.fkSitio.id,
      idProductoId: inv.idProducto.id,
    });
    setEditingId(inv.idProductoInventario);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteInventario(id);
    fetchInventarios();
  };

  const resetForm = () => {
    setFormData({ stock: 0, fkSitioId: 0, idProductoId: 0 });
    setEditingId(null);
  };

  const getStockBarColor = (stock: number) => {
    if (stock === 0) return "bg-red-500";
    if (stock <= 10) return "bg-orange-400";
    if (stock <= 50) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getStockPercentage = (stock: number) => {
    return `${Math.min((stock / 100) * 100, 100)}%`;
  };

  const filtered = inventarios.filter((inv) =>
    inv.idProducto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📦 Inventario</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" /> Crear
          </button>
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

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

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Editar Inventario" : "Crear Inventario"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className="text-gray-600 hover:text-red-500"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <input
                type="number"
                name="stock"
                placeholder="Cantidad en stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                required
              />

              <select
                name="fkSitioId"
                value={formData.fkSitioId}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Seleccione un sitio</option>
                {sitios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>

              <select
                name="idProductoId"
                value={formData.idProductoId}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
