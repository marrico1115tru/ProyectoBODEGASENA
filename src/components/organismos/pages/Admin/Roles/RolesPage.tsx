import React, { useEffect, useState } from 'react';
import { Rol } from '@/types/types/Rol';
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol
} from '@/Api/RolService';

const initialForm: Rol = {
  nombreRol: '',
  fechaInicial: '',
  fechaFinal: ''
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [form, setForm] = useState<Rol>(initialForm);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateRol(idEditando, form);
      } else {
        await createRol(form);
      }
      setForm(initialForm);
      setEditando(false);
      setIdEditando(null);
      cargarRoles();
    } catch (error) {
      console.error("❌ Error al guardar rol:", error);
    }
  };

  const handleEdit = (rol: Rol) => {
    setForm(rol);
    setEditando(true);
    setIdEditando(rol.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      await deleteRol(id);
      cargarRoles();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Roles</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          name="nombreRol"
          placeholder="Nombre del Rol"
          value={form.nombreRol}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="date"
          name="fechaInicial"
          value={form.fechaInicial}
          onChange={handleChange}
          className="input"
        />
        <input
          type="date"
          name="fechaFinal"
          value={form.fechaFinal}
          onChange={handleChange}
          className="input"
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Rol' : 'Crear Rol'}
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
          {roles.map((rol) => (
            <tr key={rol.id}>
              <td className="border px-2 py-1">{rol.id}</td>
              <td className="border px-2 py-1">{rol.nombreRol}</td>
              <td className="border px-2 py-1">{rol.fechaInicial?.split('T')[0]}</td>
              <td className="border px-2 py-1">{rol.fechaFinal?.split('T')[0]}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleEdit(rol)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(rol.id!)}
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
