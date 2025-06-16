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
import { PlusIcon } from "lucide-react";

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
    setFormData({
      stock: 0,
      fkSitioId: 0,
      idProductoId: 0,
    });
    setEditingId(null);
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">📦 Inventario</h1>
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
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Sitio</th>
                <th className="px-4 py-2">Ubicación</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No hay inventario registrado.
                  </td>
                </tr>
              ) : (
                inventarios.map((inv) => (
                  <tr key={inv.idProductoInventario} className="border-t">
                    <td className="px-4 py-2">{inv.idProducto.nombre}</td>
                    <td className="px-4 py-2">{inv.idProducto.descripcion}</td>
                    <td className="px-4 py-2">{inv.stock}</td>
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded p-6 w-full max-w-md shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Editar Inventario" : "Crear Inventario"}
              </h2>

              <input
                type="number"
                name="stock"
                placeholder="Cantidad en stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <select
                name="fkSitioId"
                value={formData.fkSitioId}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
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
                className="w-full mb-4 p-2 border rounded"
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

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
      </div>
    </DefaultLayout>
  );
}
