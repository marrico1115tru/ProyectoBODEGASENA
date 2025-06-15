import { useEffect, useState } from 'react';
import { getSedes, createSede, updateSede, deleteSede } from '@/Api/SedesService';
import { getCentrosFormacion } from '@/Api/centrosformacionTable';
import { Sede, SedeFormValues } from '@/types/types/Sede';
import { CentroFormacion } from '@/types/types/typesCentroFormacion';
import DefaultLayout from '@/layouts/default';
import { PlusIcon } from 'lucide-react';

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [formData, setFormData] = useState<SedeFormValues>({
    nombre: '',
    ubicacion: '',
    idCentroFormacion: { id: 0 },
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSedes();
    fetchCentros();
  }, []);

  const fetchSedes = async () => {
    const data = await getSedes();
    setSedes(data);
  };

  const fetchCentros = async () => {
    const data = await getCentrosFormacion();
    setCentros(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'idCentroFormacion') {
      setFormData({ ...formData, idCentroFormacion: { id: Number(value) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSede(editingId, formData);
      } else {
        await createSede(formData);
      }
      fetchSedes();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar sede:', error);
    }
  };

  const handleEdit = (sede: Sede) => {
    setFormData({
      nombre: sede.nombre ?? '',
      ubicacion: sede.ubicacion ?? '',
      idCentroFormacion: { id: sede.idCentroFormacion?.id ?? 0 },
    });
    setEditingId(sede.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteSede(id);
    fetchSedes();
  };

  const resetForm = () => {
    setFormData({ nombre: '', ubicacion: '', idCentroFormacion: { id: 0 } });
    setEditingId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sedes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sedes.length / itemsPerPage);

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">🏢 Gestión de Sedes</h1>
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
                <th className="px-4 py-2">Centro de Formación</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No hay sedes registradas.
                  </td>
                </tr>
              ) : (
                currentItems.map((sede) => (
                  <tr key={sede.id} className="border-t">
                    <td className="px-4 py-2">{sede.id}</td>
                    <td className="px-4 py-2">{sede.nombre}</td>
                    <td className="px-4 py-2">{sede.ubicacion}</td>
                    <td className="px-4 py-2">{sede.idCentroFormacion?.nombre ?? 'Sin centro'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(sede)} className="text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleDelete(sede.id)} className="text-red-600 hover:underline">Eliminar</button>
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
                {editingId ? 'Editar Sede' : 'Crear Sede'}
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
                className="w-full mb-4 p-2 border rounded"
              />
              <select
                name="idCentroFormacion"
                value={formData.idCentroFormacion.id}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="0">Seleccione un centro de formación</option>
                {centros.map((centro) => (
                  <option key={centro.id} value={centro.id}>
                    {centro.nombre}
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
