// pages/EntregaMaterialPage.tsx
import React, { useEffect, useState } from 'react';
import { EntregaMaterial } from '@/types/types/EntregaMaterial';
import { getEntregas, createEntrega, updateEntrega, deleteEntrega } from '@/Api/entregaMaterial';

export default function EntregaMaterialPage() {
  const [entregas, setEntregas] = useState<EntregaMaterial[]>([]);
  const [form, setForm] = useState<EntregaMaterial>({
    solicitudId: 0,
    usuarioResponsableId: 0,
    fechaEntrega: '',
    observaciones: '',
    fechaInicial: '',
    fechaFinal: '',
  });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    loadEntregas();
  }, []);

  const loadEntregas = async () => {
    try {
      const data = await getEntregas();
      setEntregas(data);
    } catch (error) {
      console.error('Error cargando entregas:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && form.id) {
        await updateEntrega(form.id, form);
        setEditando(false);
      } else {
        await createEntrega(form);
      }
      setForm({
        solicitudId: 0,
        usuarioResponsableId: 0,
        fechaEntrega: '',
        observaciones: '',
        fechaInicial: '',
        fechaFinal: '',
      });
      loadEntregas();
    } catch (error) {
      console.error('Error guardando entrega:', error);
    }
  };

  const handleEdit = (entrega: EntregaMaterial) => {
    setForm({
      id: entrega.id,
      solicitudId: entrega.solicitudId,
      usuarioResponsableId: entrega.usuarioResponsableId,
      fechaEntrega: entrega.fechaEntrega.slice(0, 16),
      observaciones: entrega.observaciones || '',
      fechaInicial: entrega.fechaInicial ? entrega.fechaInicial.slice(0, 16) : '',
      fechaFinal: entrega.fechaFinal ? entrega.fechaFinal.slice(0, 16) : '',
    });
    setEditando(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteEntrega(id);
      setEntregas(entregas.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error eliminando entrega:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Entregas de Material</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-100 rounded shadow">
        <input
          type="number"
          name="solicitudId"
          placeholder="ID Solicitud"
          value={form.solicitudId || ''}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="usuarioResponsableId"
          placeholder="ID Usuario Responsable"
          value={form.usuarioResponsableId || ''}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="fechaEntrega"
          value={form.fechaEntrega || ''}
          onChange={handleChange}
          required
        />
        <textarea
          name="observaciones"
          placeholder="Observaciones (opcional)"
          value={form.observaciones || ''}
          onChange={handleChange}
          rows={2}
          className="resize-none"
        />
        <input
          type="datetime-local"
          name="fechaInicial"
          value={form.fechaInicial || ''}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="fechaFinal"
          value={form.fechaFinal || ''}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editando ? 'Actualizar Entrega' : 'Crear Entrega'}
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-300">
          <tr>
            <th className="border px-3 py-1">ID</th>
            <th className="border px-3 py-1">Solicitud ID</th>
            <th className="border px-3 py-1">Usuario Responsable ID</th>
            <th className="border px-3 py-1">Fecha Entrega</th>
            <th className="border px-3 py-1">Observaciones</th>
            <th className="border px-3 py-1">Fecha Inicial</th>
            <th className="border px-3 py-1">Fecha Final</th>
            <th className="border px-3 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((e) => (
            <tr key={e.id}>
              <td className="border px-3 py-1">{e.id}</td>
              <td className="border px-3 py-1">{e.solicitudId}</td>
              <td className="border px-3 py-1">{e.usuarioResponsableId}</td>
              <td className="border px-3 py-1">{new Date(e.fechaEntrega).toLocaleString()}</td>
              <td className="border px-3 py-1">{e.observaciones || '-'}</td>
              <td className="border px-3 py-1">{e.fechaInicial ? new Date(e.fechaInicial).toLocaleString() : '-'}</td>
              <td className="border px-3 py-1">{e.fechaFinal ? new Date(e.fechaFinal).toLocaleString() : '-'}</td>
              <td className="border px-3 py-1">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => e.id && handleDelete(e.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {entregas.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-4">No hay entregas registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
