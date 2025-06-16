import { useEffect, useState } from "react";
import {
  getDetalleSolicitudes,
  createDetalleSolicitud,
  updateDetalleSolicitud,
  deleteDetalleSolicitud,
} from "@/Api/detalles_solicitud";
import { DetalleSolicitud } from "@/types/types/detalles_solicitud";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

export default function DetalleSolicitudPage() {
  const [detalles, setDetalles] = useState<DetalleSolicitud[]>([]);
  const [formData, setFormData] = useState<Partial<DetalleSolicitud>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

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
      alert("Todos los campos son obligatorios");
      return;
    }

    const payload = {
      cantidadSolicitada: formData.cantidadSolicitada,
      observaciones: formData.observaciones || null,
      idProducto: formData.idProducto,
      idSolicitud: formData.idSolicitud,
    };

    if (editId) {
      await updateDetalleSolicitud(editId, payload);
    } else {
      await createDetalleSolicitud(payload);
    }

    setFormData({});
    setEditId(null);
    setShowForm(false);
    fetchDetalles();
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
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalle de Solicitudes</h1>
        <button
          onClick={() => {
            setFormData({});
            setEditId(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Detalle
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
          <input
            type="number"
            name="cantidadSolicitada"
            placeholder="Cantidad solicitada"
            value={formData.cantidadSolicitada || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <textarea
            name="observaciones"
            placeholder="Observaciones"
            value={formData.observaciones || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            name="idProducto"
            placeholder="ID Producto"
            value={formData.idProducto?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                idProducto: { id: Number(e.target.value), nombre: "" },
              })
            }
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="number"
            name="idSolicitud"
            placeholder="ID Solicitud"
            value={formData.idSolicitud?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                idSolicitud: { id: Number(e.target.value) },
              })
            }
            className="w-full border p-2 rounded mb-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Observaciones</th>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Solicitud</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle) => (
              <tr key={detalle.id} className="border-t">
                <td className="px-4 py-2">{detalle.id}</td>
                <td className="px-4 py-2">{detalle.cantidadSolicitada}</td>
                <td className="px-4 py-2">{detalle.observaciones || "-"}</td>
                <td className="px-4 py-2">{detalle.idProducto.nombre}</td>
                <td className="px-4 py-2">{detalle.idSolicitud.id}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(detalle)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(detalle.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
