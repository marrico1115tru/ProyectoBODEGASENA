import { useEffect, useState } from 'react';
import {
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from '@/Api/centrosformacionTable';
import { CentroFormacion, CentroFormacionFormValues } from '@/types/types/typesCentroFormacion';
import DefaultLayout from '@/layouts/default';
import { PlusIcon } from 'lucide-react';
import axios from 'axios';

interface Municipio {
  id: number;
  nombre: string;
  departamento: string;
}

export default function CentroFormacionPage() {
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [formData, setFormData] = useState<CentroFormacionFormValues>({
    nombre: '',
    ubicacion: '',
    telefono: '',
    email: '',
    idMunicipio: { id: 0 },
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCentros();
    fetchMunicipios();
  }, []);

  const fetchCentros = async () => {
    const data = await getCentrosFormacion();
    setCentros(data);
  };

  const fetchMunicipios = async () => {
    const res = await axios.get('http://localhost:3000/municipios');
    setMunicipios(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'idMunicipio') {
      setFormData({ ...formData, idMunicipio: { id: Number(value) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCentroFormacion(editingId, formData);
      } else {
        await createCentroFormacion(formData);
      }
      fetchCentros();
      setIsModalOpen(false);
      setFormData({ nombre: '', ubicacion: '', telefono: '', email: '', idMunicipio: { id: 0 } });
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (centro: CentroFormacion) => {
    setFormData({
      nombre: centro.nombre ?? '',
      ubicacion: centro.ubicacion ?? '',
      telefono: centro.telefono ?? '',
      email: centro.email ?? '',
      idMunicipio: { id: centro.idMunicipio?.id ?? 0 },
    });
    setEditingId(centro.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteCentroFormacion(id);
    fetchCentros();
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            🏫 Gestión de Centros de Formación
          </h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingId(null);
              setFormData({
                nombre: '',
                ubicacion: '',
                telefono: '',
                email: '',
                idMunicipio: { id: 0 },
              });
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
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Municipio</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {centros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No hay centros registrados.
                  </td>
                </tr>
              ) : (
                centros.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.id}</td>
                    <td className="px-4 py-2">{c.nombre}</td>
                    <td className="px-4 py-2">{c.ubicacion}</td>
                    <td className="px-4 py-2">{c.telefono}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">{c.idMunicipio?.nombre ?? 'Sin municipio'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded p-6 w-full max-w-md shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? 'Editar Centro de Formación' : 'Crear Centro de Formación'}
              </h2>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <select
                name="idMunicipio"
                value={formData.idMunicipio.id}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="0">Seleccione un municipio</option>
                {municipios.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} - {m.departamento}
                  </option>
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
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
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
