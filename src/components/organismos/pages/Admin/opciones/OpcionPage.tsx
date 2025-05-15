// src/pages/OpcionPage.tsx
import React, { useEffect, useState } from 'react';
import {
  getOpciones,
  createOpcion,
  updateOpcion,
  deleteOpcion
} from '@/Api/OpcionesService';
import { Opcion } from '@/types/types/Opcion';

const initialFormState: Opcion = {
  nombre: '',
  fechaInicial: '',
  fechaFinal: ''
};

export default function OpcionPage() {
  const [opciones, setOpciones] = useState<Opcion[]>([]);
  const [form, setForm] = useState<Opcion>(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarOpciones();
  }, []);

  const cargarOpciones = async () => {
    const data = await getOpciones();
    setOpciones(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateOpcion(idEditando, form);
      } else {
        await createOpcion(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarOpciones();
    } catch (error) {
      console.error("❌ Error al guardar opción:", error);
    }
  };

  const handleEdit = (opcion: Opcion) => {
    setForm(opcion);
    setEditando(true);
    setIdEditando(opcion.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta opción?')) {
      await deleteOpcion(id);
      cargarOpciones();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Opciones</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Opción' : 'Crear Opción'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {opciones.map((o) => (
            <tr key={o.id}>
              <td className="border px-2 py-1">{o.id}</td>
              <td className="border px-2 py-1">{o.nombre}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(o)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Editar</button>
                <button onClick={() => handleDelete(o.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
