import React, { useEffect, useState } from 'react';
import {
  getFichasFormacion,
  createFichaFormacion,
  updateFichaFormacion,
  deleteFichaFormacion
} from '@/Api/fichasFormacion';
import { FichaFormacion } from '@/types/types/FichaFormacion';

const initialFormState: FichaFormacion = {
  nombre: '',
  tituloId: 1,
  fechaInicial: '',
  fechaFinal: '',
};

export default function FichasFormacionPage() {
  const [fichas, setFichas] = useState<FichaFormacion[]>([]);
  const [form, setForm] = useState<FichaFormacion>(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarFichas();
  }, []);

  const cargarFichas = async () => {
    const data = await getFichasFormacion();
    setFichas(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateFichaFormacion(idEditando, form);
      } else {
        await createFichaFormacion(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarFichas();
    } catch (error) {
      console.error("❌ Error al guardar ficha:", error);
    }
  };

  const handleEdit = (ficha: FichaFormacion) => {
    setForm(ficha);
    setEditando(true);
    setIdEditando(ficha.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta ficha?')) {
      await deleteFichaFormacion(id);
      cargarFichas();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Fichas de Formación</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="number"
          name="tituloId"
          placeholder="Título ID"
          value={form.tituloId}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="date"
          name="fechaInicial"
          value={form.fechaInicial}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="date"
          name="fechaFinal"
          value={form.fechaFinal}
          onChange={handleChange}
          required
          className="input"
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Ficha' : 'Crear Ficha'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Título ID</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fichas.map((ficha) => (
            <tr key={ficha.id}>
              <td className="border px-2 py-1">{ficha.id}</td>
              <td className="border px-2 py-1">{ficha.nombre}</td>
              <td className="border px-2 py-1">{ficha.tituloId}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(ficha)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded">
                  Editar
                </button>
                <button onClick={() => handleDelete(ficha.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
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
