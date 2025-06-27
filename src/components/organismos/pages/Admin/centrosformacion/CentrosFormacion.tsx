import { useEffect, useState } from 'react';
import {
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from '@/Api/centrosformacionTable';
import { CentroFormacion, CentroFormacionFormValues } from '@/types/types/typesCentroFormacion';
import DefaultLayout from '@/layouts/default';
import { PlusIcon, XIcon } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';

interface Municipio {
  id: number;
  nombre: string;
  departamento: string;
}

const centroSchema = z.object({
  nombre: z.string().min(3, 'Nombre requerido'),
  ubicacion: z.string().min(3, 'Ubicación requerida'),
  telefono: z.string().min(7, 'Teléfono requerido'),
  email: z.string().email('Correo inválido'),
  idMunicipio: z.object({ id: z.number().min(1, 'Seleccione un municipio') }),
});
type CentroSchema = z.infer<typeof centroSchema>;

export default function CentroFormacionPage() {
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CentroSchema>({ resolver: zodResolver(centroSchema) });

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

  const onSubmit = async (data: CentroSchema) => {
    try {
      if (editingId) {
        await updateCentroFormacion(editingId, data);
        toast.success('Centro actualizado');
      } else {
        await createCentroFormacion(data);
        toast.success('Centro creado');
      }
      fetchCentros();
      setIsModalOpen(false);
      reset();
      setEditingId(null);
    } catch {
      toast.error('Error al guardar');
    }
  };

  const handleEdit = (c: CentroFormacion) => {
    setValue('nombre', c.nombre);
    setValue('ubicacion', c.ubicacion);
    setValue('telefono', c.telefono);
    setValue('email', c.email);
    setValue('idMunicipio', { id: c.idMunicipio?.id ?? 0 });
    setEditingId(c.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Eliminar centro?')) {
      await deleteCentroFormacion(id);
      fetchCentros();
    }
  };

  const filtered = centros.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🏫 Centros de Formación</h1>
          <button
            onClick={() => {
              reset();
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" /> Crear
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar centro..."
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100">
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No hay resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{c.id}</td>
                    <td className="px-4 py-2">{c.nombre}</td>
                    <td className="px-4 py-2">{c.ubicacion}</td>
                    <td className="px-4 py-2">{c.telefono}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">
                      {c.idMunicipio?.nombre ?? 'Sin municipio'}
                    </td>
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

        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingId ? 'Editar Centro' : 'Crear Centro'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              {...register('nombre')}
              placeholder="Nombre"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}

            <input
              type="text"
              {...register('ubicacion')}
              placeholder="Ubicación"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            {errors.ubicacion && <p className="text-red-500 text-sm">{errors.ubicacion.message}</p>}

            <input
              type="text"
              {...register('telefono')}
              placeholder="Teléfono"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono.message}</p>}

            <input
              type="email"
              {...register('email')}
              placeholder="Email"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <select
              {...register('idMunicipio.id', { valueAsNumber: true })}
              className="w-full mb-2 px-3 py-2 border rounded"
            >
              <option value={0}>Seleccione un municipio</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} - {m.departamento}
                </option>
              ))}
            </select>
            {errors.idMunicipio?.id && (
              <p className="text-red-500 text-sm">{errors.idMunicipio.id.message}</p>
            )}

            <div className="flex justify-end mt-4 gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
}
