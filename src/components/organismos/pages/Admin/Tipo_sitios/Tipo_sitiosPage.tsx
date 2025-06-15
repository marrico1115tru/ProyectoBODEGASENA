import { useEffect, useState } from 'react';
import {
  getTiposSitio,
  createTipoSitio,
  updateTipoSitio,
  deleteTipoSitio
} from '@/Api/Tipo_sitios';
import { TipoSitio, TipoSitioFormValues } from '@/types/types/tipo_sitios';
import DefaultLayout from '@/layouts/default';
import { PlusIcon } from 'lucide-react';

export default function TipoSitioPage() {
  const [tipos, setTipos] = useState<TipoSitio[]>([]);
  const [formData, setFormData] = useState<TipoSitioFormValues>({ nombre: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    const data = await getTiposSitio();
    setTipos(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateTipoSitio(editingId, formData);
    } else {
      await createTipoSitio(formData);
    }
    fetchTipos();
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (tipo: TipoSitio) => {
    setFormData({ nombre: tipo.nombre ?? '' });
    setEditingId(tipo.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteTipoSitio(id);
    fetchTipos();
  };

  const resetForm = () => {
    setFormData({ nombre: '' });
    setEditingId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tipos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tipos.length / itemsPerPage);

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">🏷️ Gestión de Tipos de Sitio</h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              resetForm();
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
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">No hay registros.</td>
                </tr>
              ) : (
                currentItems.map((tipo) => (
                  <tr key={tipo.id} className="border-t">
                    <td className="px-4 py-2">{tipo.id}</td>
                    <td className="px-4 py-2">{tipo.nombre}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(tipo)} className="text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleDelete(tipo.id)} className="text-red-600 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${currentPage === num ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? 'Editar Tipo de Sitio' : 'Crear Tipo de Sitio'}
              </h2>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre del tipo de sitio"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
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
