import { useEffect, useState } from 'react';
import { getRoles, createRol, updateRol, deleteRol } from '@/Api/RolService';
import { Rol, RolFormValues } from '@/types/types/Rol';
import DefaultLayout from '@/layouts/default';
import { PlusIcon } from 'lucide-react';

export default function RolPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [formData, setFormData] = useState<RolFormValues>({ nombreRol: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateRol(editingId, formData);
    } else {
      await createRol(formData);
    }
    fetchRoles();
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (rol: Rol) => {
    setFormData({ nombreRol: rol.nombreRol });
    setEditingId(rol.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteRol(id);
    fetchRoles();
  };

  const resetForm = () => {
    setFormData({ nombreRol: '' });
    setEditingId(null);
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">🎖️ Gestión de Roles</h1>
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
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre del Rol</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">No hay registros.</td>
                </tr>
              ) : (
                roles.map((rol) => (
                  <tr key={rol.id} className="border-t">
                    <td className="px-4 py-2">{rol.id}</td>
                    <td className="px-4 py-2">{rol.nombreRol}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(rol)} className="text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleDelete(rol.id)} className="text-red-600 hover:underline">Eliminar</button>
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
            <form onSubmit={handleSubmit} className="bg-white rounded p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? 'Editar Rol' : 'Crear Rol'}
              </h2>

              <input
                type="text"
                name="nombreRol"
                placeholder="Nombre del rol"
                value={formData.nombreRol}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

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
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
