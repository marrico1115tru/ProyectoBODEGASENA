import React, { useEffect, useState } from 'react';
import {
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from '@/Api/centrosformacionTable';
import { CentroFormacion } from '@/types/types/typesCentroFormacion';

const initialFormState: CentroFormacion = {
  nombre: '',
  ubicacion: '',
  telefono: '',
  email: '',
  fechaInicial: '',
  fechaFinal: '',
};

export default function CentroFormacionPage() {
  const [centrosFormacion, setCentrosFormacion] = useState<CentroFormacion[]>([]);
  const [form, setForm] = useState<CentroFormacion>(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarCentrosFormacion();
  }, []);

  const cargarCentrosFormacion = async () => {
    const data = await getCentrosFormacion();
    setCentrosFormacion(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateCentroFormacion(idEditando, form);
      } else {
        await createCentroFormacion(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarCentrosFormacion();
    } catch (error) {
      console.error('❌ Error al guardar centro de formación:', error);
    }
  };

  const handleEdit = (centro: CentroFormacion) => {
    setForm(centro);
    setEditando(true);
    setIdEditando(centro.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este centro de formación?')) {
      await deleteCentroFormacion(id);
      cargarCentrosFormacion();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Centros de Formación</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          name="fechaInicial"
          value={form.fechaInicial || ''}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          name="fechaFinal"
          value={form.fechaFinal || ''}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editando ? 'Actualizar Centro' : 'Crear Centro'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Ubicación</th>
            <th className="border px-2 py-1">Teléfono</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {centrosFormacion.map((centro) => (
            <tr key={centro.id}>
              <td className="border px-2 py-1">{centro.id}</td>
              <td className="border px-2 py-1">{centro.nombre}</td>
              <td className="border px-2 py-1">{centro.ubicacion}</td>
              <td className="border px-2 py-1">{centro.telefono}</td>
              <td className="border px-2 py-1">{centro.email}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleEdit(centro)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(centro.id!)}
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
