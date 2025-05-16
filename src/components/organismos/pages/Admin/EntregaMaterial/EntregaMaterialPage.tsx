import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layouts/default';

interface EntregaMaterial {
  id: number;
  solicitudId: number;
  usuarioResponsableId: number;
  fechaEntrega: string;
  observaciones?: string | null;
  fechaInicial?: string;
  fechaFinal?: string;
}

const initialForm: Omit<EntregaMaterial, 'id' | 'fechaInicial' | 'fechaFinal'> = {
  solicitudId: 0,
  usuarioResponsableId: 0,
  fechaEntrega: '',
  observaciones: '',
};

const API_URL = 'http://localhost:3500/api/entrega-material';

export default function EntregaMaterialPage() {
  const [entregas, setEntregas] = useState<EntregaMaterial[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarEntregas();
  }, []);

  async function cargarEntregas() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar entregas');
      const data: EntregaMaterial[] = await res.json();
      setEntregas(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'solicitudId' || name === 'usuarioResponsableId'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.solicitudId || !form.usuarioResponsableId || !form.fechaEntrega) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      if (editando && idEditando !== null) {
        await fetch(`${API_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }

      setForm(initialForm);
      setEditando(false);
      setIdEditando(null);
      await cargarEntregas();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la entrega');
    }
  };

  const handleEdit = (entrega: EntregaMaterial) => {
    setForm({
      solicitudId: entrega.solicitudId,
      usuarioResponsableId: entrega.usuarioResponsableId,
      fechaEntrega: entrega.fechaEntrega.split('T')[0],
      observaciones: entrega.observaciones ?? '',
    });
    setEditando(true);
    setIdEditando(entrega.id ?? null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta entrega?')) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await cargarEntregas();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar entrega');
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gestión de Entregas de Material</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow"
        >
          <input
            type="number"
            name="solicitudId"
            placeholder="ID Solicitud"
            value={form.solicitudId || ''}
            onChange={handleChange}
            required
            min={1}
            className="border rounded px-2 py-1"
          />
          <input
            type="number"
            name="usuarioResponsableId"
            placeholder="ID Usuario Responsable"
            value={form.usuarioResponsableId || ''}
            onChange={handleChange}
            required
            min={1}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            name="fechaEntrega"
            value={form.fechaEntrega || ''}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1"
          />
          <textarea
            name="observaciones"
            placeholder="Observaciones"
            value={form.observaciones || ''}
            onChange={handleChange}
            className="border rounded px-2 py-1 col-span-2"
            rows={3}
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editando ? 'Actualizar Entrega' : 'Crear Entrega'}
          </button>
        </form>

        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Solicitud ID</th>
              <th className="border px-2 py-1">Usuario Responsable ID</th>
              <th className="border px-2 py-1">Fecha Entrega</th>
              <th className="border px-2 py-1">Observaciones</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((entrega) => (
              <tr key={entrega.id}>
                <td className="border px-2 py-1">{entrega.id}</td>
                <td className="border px-2 py-1">{entrega.solicitudId}</td>
                <td className="border px-2 py-1">{entrega.usuarioResponsableId}</td>
                <td className="border px-2 py-1">
                  {entrega.fechaEntrega.split('T')[0]}
                </td>
                <td className="border px-2 py-1">{entrega.observaciones || '-'}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(entrega)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(entrega.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {entregas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No hay entregas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
