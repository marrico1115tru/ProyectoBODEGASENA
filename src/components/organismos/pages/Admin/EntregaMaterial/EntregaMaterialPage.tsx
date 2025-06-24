import { useEffect, useState } from "react";
import {
  getEntregasMaterial,
  createEntregaMaterial,
  updateEntregaMaterial,
  deleteEntregaMaterial,
} from "@/Api/entregaMaterial";
import { EntregaMaterial } from "@/types/types/EntregaMaterial";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

export default function EntregaMaterialPage() {
  const [entregas, setEntregas] = useState<EntregaMaterial[]>([]);
  const [formData, setFormData] = useState<Partial<EntregaMaterial>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEntregas();
  }, []);

  const fetchEntregas = async () => {
    const data = await getEntregasMaterial();
    setEntregas(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fechaEntrega || !formData.idFichaFormacion || !formData.idSolicitud || !formData.idUsuarioResponsable) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const payload: EntregaMaterial = {
      fechaEntrega: formData.fechaEntrega,
      observaciones: formData.observaciones || null,
      idFichaFormacion: formData.idFichaFormacion,
      idSolicitud: formData.idSolicitud,
      idUsuarioResponsable: formData.idUsuarioResponsable,
    };

    if (editId) {
      await updateEntregaMaterial(editId, payload);
    } else {
      await createEntregaMaterial(payload);
    }

    setFormData({});
    setEditId(null);
    setShowForm(false);
    fetchEntregas();
  };

  const handleEdit = (data: EntregaMaterial) => {
    setFormData(data);
    setEditId(data.id!);
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("¿Eliminar esta entrega?")) {
      await deleteEntregaMaterial(id);
      fetchEntregas();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Entregas de Material</h1>
        <button
          onClick={() => {
            setFormData({});
            setEditId(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Crear Entrega
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
          <input
            type="date"
            name="fechaEntrega"
            value={formData.fechaEntrega || ""}
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
            name="idFichaFormacion"
            placeholder="ID Ficha Formación"
            value={formData.idFichaFormacion?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                idFichaFormacion: { id: Number(e.target.value) },
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
          <input
            type="number"
            name="idUsuarioResponsable"
            placeholder="ID Usuario Responsable"
            value={formData.idUsuarioResponsable?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                idUsuarioResponsable: { id: Number(e.target.value) },
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
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Observaciones</th>
              <th className="px-4 py-2">Ficha</th>
              <th className="px-4 py-2">Solicitud</th>
              <th className="px-4 py-2">Responsable</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((entrega) => (
              <tr key={entrega.id} className="border-t">
                <td className="px-4 py-2">{entrega.id}</td>
                <td className="px-4 py-2">{entrega.fechaEntrega}</td>
                <td className="px-4 py-2">{entrega.observaciones || "-"}</td>
                <td className="px-4 py-2">{entrega.idFichaFormacion?.nombre || entrega.idFichaFormacion?.id}</td>
                <td className="px-4 py-2">{entrega.idSolicitud.id}</td>
                <td className="px-4 py-2">
                  {entrega.idUsuarioResponsable?.nombre || "Usuario ID: " + entrega.idUsuarioResponsable?.id}
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(entrega)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entrega.id)}
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
