import { useEffect, useState } from 'react';
import {
  obtenerMunicipios,
  crearMunicipio,
  eliminarMunicipio,
  actualizarMunicipio,
} from '@/Api/MunicipiosForm';
import { Municipio } from '@/types/types/typesMunicipio';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import DefaultLayout from '@/layouts/default';

export default function MunicipiosView() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<Municipio, 'id'>>({ nombre: '', departamento: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const cargarMunicipios = async () => {
    try {
      const data = await obtenerMunicipios();
      setMunicipios(data);
    } catch (err) {
      console.error('Error cargando municipios', err);
    }
  };

  useEffect(() => { cargarMunicipios(); }, []);

  const abrirCrear = () => {
    setForm({ nombre: '', departamento: '' });
    setEditId(null);
    setModalOpen(true);
  };

  const abrirEditar = (m: Municipio) => {
    setForm({ nombre: m.nombre || '', departamento: m.departamento || '' });
    setEditId(m.id);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setForm({ nombre: '', departamento: '' });
    setEditId(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await actualizarMunicipio(editId, form);
    else await crearMunicipio(form);
    cerrarModal();
    cargarMunicipios();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar municipio?')) {
      await eliminarMunicipio(id);
      cargarMunicipios();
    }
  };

  const filtrados = municipios.filter(m =>
    `${m.nombre} ${m.departamento}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <img src="/icono-municipio.png" alt="" className="w-8 h-8" />
            Gestión de Municipios
          </h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre o departamento"
              className="border rounded px-3 py-1 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={abrirCrear}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" /> Crear
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="bg-green-200 text-green-900 px-2 py-1 rounded">
            <EyeIcon className="inline w-4 h-4 mr-1" /> ID
          </span>
          <span className="bg-green-200 text-green-900 px-2 py-1 rounded">
            <EyeIcon className="inline w-4 h-4 mr-1" /> Nombre
          </span>
          <span className="bg-green-200 text-green-900 px-2 py-1 rounded">
            <EyeIcon className="inline w-4 h-4 mr-1" /> Departamento
          </span>
          <span className="bg-green-200 text-green-900 px-2 py-1 rounded">
            <EyeIcon className="inline w-4 h-4 mr-1" /> Acciones
          </span>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg border mb-6">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100">
              <tr>
                {['ID','Nombre','Departamento','Acciones'].map(col => (
                  <th key={col} className="p-4 text-left font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No se encontraron municipios.
                  </td>
                </tr>
              ) : (
                filtrados.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{m.id}</td>
                    <td className="px-4 py-3">{m.nombre}</td>
                    <td className="px-4 py-3">{m.departamento}</td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <button onClick={() => abrirEditar(m)} title="Editar" className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} title="Eliminar" className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button onClick={cerrarModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <XIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {editId ? 'Editar Municipio' : 'Crear Municipio'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Nombre</label>
                  <input
                    type="text"
                    value={form.nombre || ''}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Departamento</label>
                  <input
                    type="text"
                    value={form.departamento || ''}
                    onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                    required
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={cerrarModal} className="px-4 py-2 border rounded hover:bg-gray-100">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {editId ? 'Actualizar' : 'Crear'}
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
