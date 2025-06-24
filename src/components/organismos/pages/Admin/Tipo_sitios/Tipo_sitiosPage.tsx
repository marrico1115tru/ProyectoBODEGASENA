import { useEffect, useState } from 'react';
import {
  getTiposSitio,
  createTipoSitio,
  updateTipoSitio,
  deleteTipoSitio,
} from '@/Api/Tipo_sitios';
import { TipoSitio } from '@/types/types/tipo_sitios';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, XIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const tipoSitioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
});

type TipoSitioSchema = z.infer<typeof tipoSitioSchema>;

export default function TipoSitioPage() {
  const [tipos, setTipos] = useState<TipoSitio[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TipoSitioSchema>({
    resolver: zodResolver(tipoSitioSchema),
  });

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    const data = await getTiposSitio();
    setTipos(data);
  };

  const onSubmit = async (data: TipoSitioSchema) => {
    try {
      if (editingId) {
        await updateTipoSitio(editingId, data);
        toast.success('Tipo de sitio actualizado');
      } else {
        await createTipoSitio(data);
        toast.success('Tipo de sitio creado');
      }
      fetchTipos();
      reset();
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar el tipo de sitio');
    }
  };

  const handleEdit = (tipo: TipoSitio) => {
    setValue('nombre', tipo.nombre);
    setEditingId(tipo.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este tipo de sitio?')) {
      await deleteTipoSitio(id);
      fetchTipos();
    }
  };

  const filteredTipos = tipos.filter((tipo) =>
    tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTipos.length / itemsPerPage);
  const paginatedTipos = filteredTipos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🏷️ Tipos de Sitio</h1>
          <button
            onClick={() => {
              reset();
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> Crear
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar tipo de sitio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTipos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                paginatedTipos.map((tipo) => (
                  <tr key={tipo.id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-2">{tipo.id}</td>
                    <td className="px-4 py-2">{tipo.nombre}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(tipo)}
                        className="text-blue-600 hover:underline"
                      >Editar</button>
                      <button
                        onClick={() => handleDelete(tipo.id)}
                        className="text-red-600 hover:underline"
                      >Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Anterior</button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >Siguiente</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Editar Tipo de Sitio' : 'Crear Tipo de Sitio'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                {...register('nombre')}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">{errors.nombre.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >Cancelar</button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              >{editingId ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
}