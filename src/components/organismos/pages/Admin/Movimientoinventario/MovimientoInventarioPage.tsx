import React, { useEffect, useState } from 'react';
import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
} from '@/Api/MovimientoInventarioApi';
import { MovimientoInventario } from '@/types/types/movimientoInventario';
import DefaultLayout from '@/layouts/default'; // Ajusta esta ruta si es necesaria

const initialFormState: MovimientoInventario = {
  productoId: 0,
  usuarioId: 0,
  tipoMovimiento: 'entrada',
  cantidad: 0,
  observaciones: '',
};

export default function MovimientoInventarioPage() {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [form, setForm] = useState<MovimientoInventario>(initialFormState);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    const data = await getMovimientos();
    setMovimientos(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === 'cantidad' || name === 'productoId' || name === 'usuarioId'
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateMovimiento(idEditando, form);
      } else {
        await createMovimiento(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarMovimientos();
    } catch (error) {
      console.error('❌ Error al guardar movimiento:', error);
    }
  };

  const handleEdit = (movimiento: MovimientoInventario) => {
    setForm(movimiento);
    setEditando(true);
    setIdEditando(movimiento.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
      await deleteMovimiento(id);
      cargarMovimientos();
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Movimientos de Inventario</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow"
        >
          <input
            type="number"
            name="productoId"
            placeholder="ID Producto"
            value={form.productoId}
            onChange={handleChange}
            required
            className="input"
            min={1}
          />
          <input
            type="number"
            name="usuarioId"
            placeholder="ID Usuario"
            value={form.usuarioId}
            onChange={handleChange}
            required
            className="input"
            min={1}
          />
          <select
            name="tipoMovimiento"
            value={form.tipoMovimiento}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={form.cantidad}
            onChange={handleChange}
            required
            className="input"
            min={1}
          />
          <textarea
            name="observaciones"
            placeholder="Observaciones"
            value={form.observaciones}
            onChange={handleChange}
            className="input col-span-2"
            rows={2}
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editando ? 'Actualizar Movimiento' : 'Crear Movimiento'}
          </button>
        </form>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Producto ID</th>
              <th className="border px-2 py-1">Usuario ID</th>
              <th className="border px-2 py-1">Tipo Movimiento</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Fecha Movimiento</th>
              <th className="border px-2 py-1">Observaciones</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td className="border px-2 py-1">{m.id}</td>
                <td className="border px-2 py-1">{m.productoId}</td>
                <td className="border px-2 py-1">{m.usuarioId}</td>
                <td className="border px-2 py-1 capitalize">{m.tipoMovimiento}</td>
                <td className="border px-2 py-1">{m.cantidad}</td>
                <td className="border px-2 py-1">
                  {m.fechaMovimiento ? new Date(m.fechaMovimiento).toLocaleString() : '-'}
                </td>
                <td className="border px-2 py-1">{m.observaciones || '-'}</td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => m.id && handleDelete(m.id)}
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
    </DefaultLayout>
  );
}
