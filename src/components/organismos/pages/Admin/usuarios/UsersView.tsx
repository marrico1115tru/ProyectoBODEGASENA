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
} from "@heroicons/react/24/solid";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Usuario>>({});
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({});
            setEditId(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Usuario
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <input name="nombre" placeholder="Nombre" value={formData.nombre || ""} onChange={handleChange} required />
            <input name="apellido" placeholder="Apellido" value={formData.apellido || ""} onChange={handleChange} />
            <input name="cedula" placeholder="Cédula" value={formData.cedula || ""} onChange={handleChange} />
            <input name="email" placeholder="Correo" value={formData.email || ""} onChange={handleChange} />
            <input name="telefono" placeholder="Teléfono" value={formData.telefono || ""} onChange={handleChange} />
            <input name="cargo" placeholder="Cargo" value={formData.cargo || ""} onChange={handleChange} />
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Ficha</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t">
                <td className="px-4 py-2">{usuario.nombre} {usuario.apellido}</td>
                <td className="px-4 py-2">{usuario.email}</td>
                <td className="px-4 py-2">{usuario.idArea?.nombreArea}</td>
                <td className="px-4 py-2">{usuario.idFichaFormacion?.nombre}</td>
                <td className="px-4 py-2">{usuario.idRol?.nombreRol}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
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
