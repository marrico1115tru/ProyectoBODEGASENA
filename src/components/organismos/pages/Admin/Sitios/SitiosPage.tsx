import { useEffect, useState } from 'react';
import {
  getSitios,
  createSitio,
  updateSitio,
  deleteSitio,
} from '@/Api/SitioService';
import { Sitio, SitioFormValues } from '@/types/types/Sitio';
import DefaultLayout from '@/layouts/default';
import { PlusIcon } from 'lucide-react';
import { getAreas } from '@/Api/AreasService';
import { getTiposSitio } from '@/Api/Tipo_sitios';

export default function SitioPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [formData, setFormData] = useState<SitioFormValues>({
    nombre: '',
    ubicacion: '',
    idArea: { id: 0 },
    idTipoSitio: { id: 0 },
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areas, setAreas] = useState<{ id: number; nombreArea: string }[]>([]);
  const [tiposSitio, setTiposSitio] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    fetchSitios();
    fetchAreas();
    fetchTiposSitio();
  }, []);

  const fetchSitios = async () => {
    const data = await getSitios();
    setSitios(data);
  };

  const fetchAreas = async () => {
    const res = await getAreas();
    setAreas(res);
  };

  const fetchTiposSitio = async () => {
    const res = await getTiposSitio();
    setTiposSitio(res);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: { id: parseInt(value, 10) } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateSitio(editingId, formData);
    } else {
      await createSitio(formData);
    }
    fetchSitios();
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (sitio: Sitio) => {
    setFormData({
      nombre: sitio.nombre ?? '',
      ubicacion: sitio.ubicacion ?? '',
      idArea: { id: sitio.idArea.id },
      idTipoSitio: { id: sitio.idTipoSitio.id },
    });
    setEditingId(sitio.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteSitio(id);
    fetchSitios();
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      ubicacion: '',
      idArea: { id: 0 },
      idTipoSitio: { id: 0 },
    });
    setEditingId(null);
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">📍 Gestión de Sitios</h1>
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
                <th className="px-4 py-2">Ubicación</th>
                <th className="px-4 py-2">Área</th>
                <th className="px-4 py-2">Tipo de Sitio</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sitios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">No hay registros.</td>
                </tr>
              ) : (
                sitios.map((sitio) => (
                  <tr key={sitio.id} className="border-t">
                    <td className="px-4 py-2">{sitio.id}</td>
                    <td className="px-4 py-2">{sitio.nombre}</td>
                    <td className="px-4 py-2">{sitio.ubicacion}</td>
                    <td className="px-4 py-2">{sitio.idArea.nombreArea}</td>
                    <td className="px-4 py-2">{sitio.idTipoSitio.nombre}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(sitio)} className="text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleDelete(sitio.id)} className="text-red-600 hover:underline">Eliminar</button>
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
                {editingId ? 'Editar Sitio' : 'Crear Sitio'}
              </h2>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre del sitio"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />

              <select
                name="idArea"
                value={formData.idArea.id}
                onChange={handleSelect}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value={0}>Seleccione un área</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombreArea}</option>
                ))}
              </select>

              <select
                name="idTipoSitio"
                value={formData.idTipoSitio.id}
                onChange={handleSelect}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value={0}>Seleccione tipo de sitio</option>
                {tiposSitio.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>

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
