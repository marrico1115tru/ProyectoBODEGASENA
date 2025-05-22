import React, { useEffect, useState } from 'react';
import { Sitio } from '@/types/types/Sitio';
import {
  getSitios,
  createSitio,
  updateSitio,
  deleteSitio,
} from '@/Api/SitioService';
import DefaultLayout from '@/layouts/default'; 

const initialForm: Sitio = {
  nombre: '',
  ubicacion: '',
  tipoSitioId: 0,
  fechaInicial: '',
  fechaFinal: '',
  activo: true,
};

export default function SitiosPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [form, setForm] = useState<Sitio>(initialForm);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarSitios();
  }, []);

  const cargarSitios = async () => {
    try {
      const data = await getSitios();
      setSitios(data);
    } catch (error) {
      console.error('Error al cargar sitios:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;

    let value: string | number | boolean;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      value = target.checked;
    } else if (target instanceof HTMLInputElement && target.type === 'number') {
      value = target.value === '' ? '' : Number(target.value);
    } else {
      value = target.value;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateSitio(idEditando, form);
      } else {
        await createSitio(form);
      }
      setForm(initialForm);
      setEditando(false);
      setIdEditando(null);
      cargarSitios();
    } catch (error) {
      console.error(' Error al guardar sitio:', error);
    }
  };

  const handleEdit = (sitio: Sitio) => {
    setForm(sitio);
    setEditando(true);
    setIdEditando(sitio.id ?? null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este sitio?')) {
      try {
        await deleteSitio(id);
        cargarSitios();
      } catch (error) {
        console.error('Error al eliminar sitio:', error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Gestión de Sitios</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-6 rounded-2xl shadow"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Sitio"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="number"
            name="tipoSitioId"
            placeholder="ID Tipo de Sitio"
            value={form.tipoSitioId || ''}
            onChange={handleChange}
            required
            min={1}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="date"
            name="fechaInicial"
            value={form.fechaInicial.split('T')[0] || ''}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="date"
            name="fechaFinal"
            value={form.fechaFinal.split('T')[0] || ''}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <label className="flex items-center space-x-2 col-span-1 md:col-span-2">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm text-gray-700">Activo</span>
          </label>

          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editando ? 'Actualizar Sitio' : 'Crear Sitio'}
          </button>
        </form>

        <div className="bg-white p-4 rounded-2xl shadow">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="border px-2 py-2">ID</th>
                <th className="border px-2 py-2">Nombre</th>
                <th className="border px-2 py-2">Ubicación</th>
                <th className="border px-2 py-2">Tipo Sitio ID</th>
                <th className="border px-2 py-2">Fecha Inicial</th>
                <th className="border px-2 py-2">Fecha Final</th>
                <th className="border px-2 py-2">Activo</th>
                <th className="border px-2 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sitios.map((sitio) => (
                <tr key={sitio.id} className="hover:bg-slate-50">
                  <td className="border px-2 py-1">{sitio.id}</td>
                  <td className="border px-2 py-1">{sitio.nombre}</td>
                  <td className="border px-2 py-1">{sitio.ubicacion}</td>
                  <td className="border px-2 py-1">{sitio.tipoSitioId}</td>
                  <td className="border px-2 py-1">
                    {sitio.fechaInicial.split('T')[0]}
                  </td>
                  <td className="border px-2 py-1">{sitio.fechaFinal.split('T')[0]}</td>
                  <td className="border px-2 py-1">{sitio.activo ? 'Sí' : 'No'}</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleEdit(sitio)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => sitio.id && handleDelete(sitio.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {sitios.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No hay sitios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
