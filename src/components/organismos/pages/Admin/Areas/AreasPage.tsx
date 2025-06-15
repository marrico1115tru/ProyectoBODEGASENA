import { useEffect, useState } from 'react';
import { getAreas, createArea, updateArea, deleteArea } from '@/Api/AreasService';
import { getSedes } from '@/Api/SedesService';
import { Area, AreaFormValues } from '@/types/types/typesArea';
import { Sede } from '@/types/types/Sede';
import DefaultLayout from '@/layouts/default';
import { PlusIcon } from 'lucide-react';

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [formData, setFormData] = useState<AreaFormValues>({
    nombreArea: '',
    idSede: { id: 0 },
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAreas();
    fetchSedes();
  }, []);

  const fetchAreas = async () => {
    const data = await getAreas();
    setAreas(data);
  };

  const fetchSedes = async () => {
    const data = await getSedes();
    setSedes(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'idSede') {
      setFormData({ ...formData, idSede: { id: Number(value) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateArea(editingId, formData);
    } else {
      await createArea(formData);
    }
    fetchAreas();
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (area: Area) => {
    setFormData({
      nombreArea: area.nombreArea ?? '',
      idSede: { id: area.idSede?.id ?? 0 },
    });
    setEditingId(area.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteArea(id);
    fetchAreas();
  };

  const resetForm = () => {
    setFormData({ nombreArea: '', idSede: { id: 0 } });
    setEditingId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = areas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(areas.length / itemsPerPage);

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">🏬 Gestión de Áreas</h1>
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
                <th className="px-4 py-2">Nombre del Área</th>
                <th className="px-4 py-2">Sede</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">No hay áreas registradas.</td>
                </tr>
              ) : (
                currentItems.map((area) => (
                  <tr key={area.id} className="border-t">
                    <td className="px-4 py-2">{area.id}</td>
                    <td className="px-4 py-2">{area.nombreArea}</td>
                    <td className="px-4 py-2">{area.idSede?.nombre ?? 'Sin sede'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(area)} className="text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleDelete(area.id)} className="text-red-600 hover:underline">Eliminar</button>
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
                {editingId ? 'Editar Área' : 'Crear Área'}
              </h2>

              <input
                type="text"
                name="nombreArea"
                placeholder="Nombre del Área"
                value={formData.nombreArea}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />

              <select
                name="idSede"
                value={formData.idSede.id}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="0">Seleccione una sede</option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
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
