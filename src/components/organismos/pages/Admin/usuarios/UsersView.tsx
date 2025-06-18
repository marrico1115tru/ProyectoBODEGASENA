import { useEffect, useState } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "@/Api/Usuariosform";
import { Usuario } from "@/types/types/Usuario";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Usuario>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const results = usuarios.filter(
      (u) =>
        u.nombre?.toLowerCase().includes(lower) ||
        u.apellido?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower)
    );
    setFilteredUsuarios(results);
    setCurrentPage(1); // reiniciar a la primera página al buscar
  }, [search, usuarios]);

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
    setFilteredUsuarios(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateUsuario(editId, formData);
    } else {
      await createUsuario(formData);
    }
    setShowForm(false);
    setFormData({});
    setEditId(null);
    fetchUsuarios();
  };

  const handleEdit = (usuario: Usuario) => {
    setEditId(usuario.id);
    setFormData(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      await deleteUsuario(id);
      fetchUsuarios();
    }
  };

  // Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredUsuarios.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  return (
    <DefaultLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            👥 Gestión de Usuarios
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setFormData({});
              setEditId(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Usuario
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border px-4 py-2 rounded shadow-sm"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                <th className="px-4 py-2 text-left font-semibold">Correo</th>
                <th className="px-4 py-2 text-left font-semibold">Área</th>
                <th className="px-4 py-2 text-left font-semibold">Ficha</th>
                <th className="px-4 py-2 text-left font-semibold">Rol</th>
                <th className="px-4 py-2 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                currentData.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {usuario.nombre} {usuario.apellido}
                    </td>
                    <td className="px-4 py-2">{usuario.email}</td>
                    <td className="px-4 py-2">{usuario.idArea?.nombreArea}</td>
                    <td className="px-4 py-2">{usuario.idFichaFormacion?.nombre}</td>
                    <td className="px-4 py-2">{usuario.idRol?.nombreRol}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
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

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editId ? "Editar Usuario" : "Crear Usuario"}
                </h2>
                <button onClick={() => setShowForm(false)}>
                  <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <input
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  name="cedula"
                  placeholder="Cédula"
                  value={formData.cedula || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  name="email"
                  placeholder="Correo"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  name="cargo"
                  placeholder="Cargo"
                  value={formData.cargo || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
