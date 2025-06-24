// pages/detalles/DetalleSolicitudPage.tsx
import { useEffect, useState } from "react";
import {
  getDetalleSolicitudes,
  createDetalleSolicitud,
  updateDetalleSolicitud,
  deleteDetalleSolicitud,
} from "@/Api/detalles_solicitud";
import { DetalleSolicitud } from "@/types/types/detalles_solicitud";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";

export default function DetalleSolicitudPage() {
  const [detalles, setDetalles] = useState<DetalleSolicitud[]>([]);
  const [formData, setFormData] = useState<Partial<DetalleSolicitud>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDetalles();
  }, []);

  const fetchDetalles = async () => {
    const data = await getDetalleSolicitudes();
    setDetalles(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cantidadSolicitada || !formData.idProducto || !formData.idSolicitud) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const payload = {
      cantidadSolicitada: formData.cantidadSolicitada,
      observaciones: formData.observaciones || null,
      idProducto: formData.idProducto,
      idSolicitud: formData.idSolicitud,
    };

    try {
      if (editId) {
        await updateDetalleSolicitud(editId, payload);
        toast.success("Detalle actualizado");
      } else {
        await createDetalleSolicitud(payload);
        toast.success("Detalle creado");
      }
      setFormData({});
      setEditId(null);
      setShowForm(false);
      fetchDetalles();
    } catch {
      toast.error("Error al guardar el detalle");
    }
  };

  const handleEdit = (detalle: DetalleSolicitud) => {
    setFormData(detalle);
    setEditId(detalle.id!);
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("¿Eliminar este detalle de solicitud?")) {
      await deleteDetalleSolicitud(id);
      fetchDetalles();
      toast.success("Detalle eliminado");
    }
  };

  const filteredDetalles = detalles.filter((detalle) =>
    detalle.idProducto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDetalles.length / itemsPerPage);
  const paginatedDetalles = filteredDetalles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📋 Detalles de Solicitud</h1>
          <button
            onClick={() => {
              setFormData({});
              setEditId(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Crear Detalle
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar por nombre del producto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Cantidad</th>
                <th className="px-6 py-3 font-semibold">Observaciones</th>
                <th className="px-6 py-3 font-semibold">Producto</th>
                <th className="px-6 py-3 font-semibold">Solicitud</th>
                <th className="px-6 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedDetalles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No hay detalles registrados.
                  </td>
                </tr>
              ) : (
                paginatedDetalles.map((detalle) => (
                  <tr key={detalle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-2">{detalle.id}</td>
                    <td className="px-6 py-2">{detalle.cantidadSolicitada}</td>
                    <td className="px-6 py-2">{detalle.observaciones || "—"}</td>
                    <td className="px-6 py-2">{detalle.idProducto.nombre}</td>
                    <td className="px-6 py-2">{detalle.idSolicitud.id}</td>
                    <td className="px-6 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(detalle)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(detalle.id)}
                        className="text-red-600 hover:text-red-800"
                      >
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
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
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

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Editar Detalle" : "Crear Detalle"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Cantidad Solicitada</label>
                  <input
                    type="number"
                    name="cantidadSolicitada"
                    value={formData.cantidadSolicitada || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ID Producto</label>
                  <input
                    type="number"
                    name="idProducto"
                    value={formData.idProducto?.id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idProducto: { id: Number(e.target.value), nombre: "" },
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ID Solicitud</label>
                  <input
                    type="number"
                    name="idSolicitud"
                    value={formData.idSolicitud?.id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idSolicitud: { id: Number(e.target.value) },
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
                  >
                    {editId ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}