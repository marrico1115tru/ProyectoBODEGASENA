import { useEffect, useState } from "react";
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from "@/Api/Solicitudes";
import { Solicitud } from "@/types/types/Solicitud";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [formData, setFormData] = useState<Partial<Solicitud>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    const data = await getSolicitudes();
    setSolicitudes(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fechaSolicitud || !formData.estadoSolicitud || !formData.idUsuarioSolicitante) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const payload = {
      fechaSolicitud: formData.fechaSolicitud,
      estadoSolicitud: formData.estadoSolicitud,
      idUsuarioSolicitante: formData.idUsuarioSolicitante,
    };

    if (editId) {
      await updateSolicitud(editId, payload);
    } else {
      await createSolicitud(payload);
    }

    setFormData({});
    setEditId(null);
    setShowForm(false);
    fetchSolicitudes();
  };

  const handleEdit = (solicitud: Solicitud) => {
    setFormData({
      fechaSolicitud: solicitud.fechaSolicitud,
      estadoSolicitud: solicitud.estadoSolicitud,
      idUsuarioSolicitante: solicitud.idUsuarioSolicitante,
    });
    setEditId(solicitud.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar esta solicitud?")) {
      await deleteSolicitud(id);
      fetchSolicitudes();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Solicitudes</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center"
          onClick={() => {
            setFormData({});
            setEditId(null);
            setShowForm(true);
          }}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Solicitud
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
          <input
            type="date"
            name="fechaSolicitud"
            value={formData.fechaSolicitud || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="text"
            name="estadoSolicitud"
            placeholder="Estado de la solicitud"
            value={formData.estadoSolicitud || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="number"
            name="idUsuarioSolicitante"
            placeholder="ID del Usuario Solicitante"
            value={(formData.idUsuarioSolicitante as any)?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                idUsuarioSolicitante: {
                  id: Number(e.target.value),
                  nombre: "",
                  apellido: "",
                },
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
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Solicitante</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((sol) => (
              <tr key={sol.id} className="border-t">
                <td className="px-4 py-2">{sol.id}</td>
                <td className="px-4 py-2">{sol.fechaSolicitud}</td>
                <td className="px-4 py-2">{sol.estadoSolicitud}</td>
                <td className="px-4 py-2">
                  {sol.idUsuarioSolicitante
                    ? `${sol.idUsuarioSolicitante.nombre} ${sol.idUsuarioSolicitante.apellido}`
                    : "Sin solicitante"}
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => handleEdit(sol)}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(sol.id)}
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
