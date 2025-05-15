import React, { useEffect, useState } from 'react';
import {
  getTitulados,
  createTitulado,
  updateTitulado,
  deleteTitulado
} from '@/Api/TituladosService';
import { Titulado } from '@/types/types/typesTitulados';

const initialFormState: Titulado = {
  nombre: '',
  fechaInicial: '',
  fechaFinal: ''
};

export default function TituladosPage() {
  const [titulados, setTitulados] = useState<Titulado[]>([]);
  const [form, setForm] = useState<Titulado>(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarTitulados();
  }, []);

  const cargarTitulados = async () => {
    const data = await getTitulados();
    setTitulados(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateTitulado(idEditando, form);
      } else {
        await createTitulado(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarTitulados();
    } catch (error) {
      console.error("❌ Error al guardar titulado:", error);
    }
  };

  const handleEdit = (titulado: Titulado) => {
    setForm(titulado);
    setEditando(true);
    setIdEditando(titulado.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este titulado?')) {
      await deleteTitulado(id);
      cargarTitulados();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Titulados</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <input type="date" name="fechaInicial" value={form.fechaInicial} onChange={handleChange} required className="input" />
        <input type="date" name="fechaFinal" value={form.fechaFinal} onChange={handleChange} required className="input" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Titulado' : 'Crear Titulado'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Fecha Inicial</th>
            <th className="border px-2 py-1">Fecha Final</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {titulados.map((t) => (
            <tr key={t.id}>
              <td className="border px-2 py-1">{t.id}</td>
              <td className="border px-2 py-1">{t.nombre}</td>
              <td className="border px-2 py-1">{t.fechaInicial}</td>
              <td className="border px-2 py-1">{t.fechaFinal}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(t)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Editar</button>
                <button onClick={() => handleDelete(t.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
