import { useEffect, useState } from 'react';
import {
  obtenerMunicipios,
  crearMunicipio,
  eliminarMunicipio,
  actualizarMunicipio,
} from '@/Api/MunicipiosForm';
import { obtenerPermisosPorRuta } from '@/Api/PermisosService';
import { Municipio } from '@/types/types/typesMunicipio';
import { PencilIcon, TrashIcon, PlusIcon, XIcon } from 'lucide-react';
import DefaultLayout from '@/layouts/default';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';

const municipioSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  departamento: z.string().min(1, 'Departamento requerido'),
});

type MunicipioSchema = z.infer<typeof municipioSchema>;

export default function MunicipiosView() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [idRol, setIdRol] = useState<number | null>(null);
  const [permisos, setPermisos] = useState({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MunicipioSchema>({
    resolver: zodResolver(municipioSchema),
  });

  useEffect(() => {
    const rolGuardado = localStorage.getItem('idRol');
    if (rolGuardado) {
      setIdRol(Number(rolGuardado));
    }
  }, []);

  useEffect(() => {
    if (idRol !== null) {
      fetchPermisos(idRol);
      fetchMunicipios();
    }
  }, [idRol]);

  const fetchPermisos = async (rol: number) => {
    try {
      const permisos = await obtenerPermisosPorRuta('/MunicipioPage', rol);
      setPermisos(permisos);
    } catch (err) {
      toast.error('Error al obtener permisos');
    }
  };

  const fetchMunicipios = async () => {
    const data = await obtenerMunicipios();
    setMunicipios(data);
  };

  const onSubmit = async (data: MunicipioSchema) => {
    try {
      if (editId) {
        await actualizarMunicipio(editId, data);
        toast.success('Municipio actualizado');
      } else {
        await crearMunicipio(data);
        toast.success('Municipio creado');
      }
      fetchMunicipios();
      setModalOpen(false);
      reset();
      setEditId(null);
    } catch {
      toast.error('Error al guardar municipio');
    }
  };

  const handleEdit = (m: Municipio) => {
    setValue('nombre', m.nombre ?? '');
    setValue('departamento', m.departamento ?? '');
    setEditId(m.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar municipio?')) {
      await eliminarMunicipio(id);
      fetchMunicipios();
      toast.success('Municipio eliminado');
    }
  };

  const filtered = municipios.filter((m) =>
    `${m.nombre} ${m.departamento}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="p-10 text-center text-red-600 text-xl font-semibold">
          ❌ No tienes permisos para ver esta sección.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🌍 Municipios</h1>
          {permisos.puedeCrear && (
            <button
              onClick={() => {
                reset();
                setEditId(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4" /> Crear
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Buscar municipio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full border px-4 py-2 rounded"
        />

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Departamento</th>
                {(permisos.puedeEditar || permisos.puedeEliminar) && (
                  <th className="px-4 py-2">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No hay municipios registrados.
                  </td>
                </tr>
              ) : (
                paginated.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{m.id}</td>
                    <td className="px-4 py-2">{m.nombre}</td>
                    <td className="px-4 py-2">{m.departamento}</td>
                    {(permisos.puedeEditar || permisos.puedeEliminar) && (
                      <td className="px-4 py-2 space-x-2">
                        {permisos.puedeEditar && (
                          <button
                            onClick={() => handleEdit(m)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {permisos.puedeEliminar && (
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="text-red-600 hover:underline"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    )}
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
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editId ? 'Editar Municipio' : 'Crear Municipio'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
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

            <div className="mb-4">
              <label className="block text-sm font-medium">Departamento</label>
              <input
                type="text"
                {...register('departamento')}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.departamento && (
                <p className="text-red-500 text-sm">{errors.departamento.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              >
                {editId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DefaultLayout>
  );
}
