import React, { useEffect, useState } from 'react';
import { getSitios, createSitio, updateSitio, deleteSitio } from '@/Api/SitiosForm';
import { Sitio } from '@/types/types/typesSitio';
import { TipoSitio } from '@/types/types/typesSitio';

const initialFormState: Sitio = {
  id: 0,
  nombre: '',
  ubicacion: '',
  tipoSitioId: 1,
  tipoSitio: { id: 1, nombre: 'Tipo Sitio 1' },
  fechaInicial: new Date().toISOString(),
  fechaFinal: new Date().toISOString(),
  activo: true,
};

export default function SitiosPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [tiposSitio, setTiposSitio] = useState<TipoSitio[]>([]);
  const [form, setForm] = useState<Sitio>(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarSitios();
    cargarTiposSitio();
  }, []);

  const cargarSitios = async () => {
    try {
      const data = await getSitios();
      setSitios(data);
    } catch (error) {
      console.error("❌ Error al cargar sitios:", error);
    }
  };

  const cargarTiposSitio = async () => {
    // Lógica para cargar los tipos de sitio si es necesario
    // Suponiendo que ya tienes una API configurada para esto, si no, podemos simularlo con datos estáticos
    const tipos: TipoSitio[] = [
      { id: 1, nombre: 'Tipo A' },
      { id: 2, nombre: 'Tipo B' },
    ];
    setTiposSitio(tipos);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name.includes("Id") ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateSitio(idEditando, form);
      } else {
        await createSitio(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarSitios();
    } catch (error) {
      console.error("❌ Error al guardar sitio:", error);
    }
  };

  const handleEdit = (sitio: Sitio) => {
    setForm(sitio);
    setEditando(true);
    setIdEditando(sitio.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este sitio?')) {
      try {
        await deleteSitio(id);
        cargarSitios();
      } catch (error) {
        console.error("❌ Error al eliminar sitio:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Sitios</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del sitio"
          value={form.nombre}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
          required
          className="input"
        />
        <select
          name="tipoSitioId"
          value={form.tipoSitioId}
          onChange={handleChange}
          required
          className="input"
        >
          {tiposSitio.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editando ? 'Actualizar Sitio' : 'Crear Sitio'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Ubicación</th>
            <th className="border px-2 py-1">Tipo Sitio</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sitios.map((s) => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.id}</td>
              <td className="border px-2 py-1">{s.nombre}</td>
              <td className="border px-2 py-1">{s.ubicacion}</td>
              <td className="border px-2 py-1">{s.tipoSitio.nombre}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
