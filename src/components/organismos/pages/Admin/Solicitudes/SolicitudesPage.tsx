import { useEffect, useState } from "react";
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from "@/Api/Solicitudes";
import { getUsuarios } from "@/Api/Usuariosform";
import { Solicitud, SolicitudPayload } from "@/types/types/Solicitud";
import { Usuario } from "@/types/types/Usuario";
import DefaultLayout from "@/layouts/default";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState<{
    fechaSolicitud: string;
    estadoSolicitud: string;
    idUsuarioSolicitanteId: number | "";
  }>({
    fechaSolicitud: "",
    estadoSolicitud: "",
    idUsuarioSolicitanteId: "",
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const estados = ["PENDIENTE", "APROBADA", "RECHAZADA"];

  useEffect(() => {
    fetchSolicitudes();
    fetchUsuarios();
  }, []);

  const fetchSolicitudes = async () => {
    const data = await getSolicitudes();
    setSolicitudes(data);
  };

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fechaSolicitud ||
      !formData.estadoSolicitud ||
      !formData.idUsuarioSolicitanteId
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const payload: SolicitudPayload = {
      fechaSolicitud: formData.fechaSolicitud,
      estadoSolicitud: formData.estadoSolicitud,
      idUsuarioSolicitante: {
        id: Number(formData.idUsuarioSolicitanteId),
      },
    };

    if (editId) {
      await updateSolicitud(editId, payload);
    } else {
      await createSolicitud(payload);
    }

    setFormData({
      fechaSolicitud: "",
      estadoSolicitud: "",
      idUsuarioSolicitanteId: "",
    });
    setEditId(null);
    setShowForm(false);
    fetchSolicitudes();
  };

  const handleEdit = (sol: Solicitud) => {
    setFormData({
      fechaSolicitud: sol.fechaSolicitud,
      estadoSolicitud: sol.estadoSolicitud || "",
      idUsuarioSolicitanteId: sol.idUsuarioSolicitante.id,
    });
    setEditId(sol.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar esta solicitud?")) {
      await deleteSolicitud(id);
      fetchSolicitudes();
    }
  };

  const filteredSolicitudes = solicitudes.filter((sol) =>
    sol.idUsuarioSolicitante?.nombre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);
  const currentSolicitudes = filteredSolicitudes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Solicitudes</h1>
        <button
          onClick={() => {
            setFormData({
              fechaSolicitud: "",
              estadoSolicitud: "",
              idUsuarioSolicitanteId: "",
            });
            setEditId(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear solicitud
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre del solicitante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Solicitante</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentSolicitudes.map((sol) => (
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
                    <PencilSquareIcon className="w-5 h-5" />
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Editar Solicitud" : "Crear Solicitud"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                name="fechaSolicitud"
                value={formData.fechaSolicitud}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />

              <select
                name="estadoSolicitud"
                value={formData.estadoSolicitud}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Seleccione estado</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>

              <select
                name="idUsuarioSolicitanteId"
                value={formData.idUsuarioSolicitanteId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
