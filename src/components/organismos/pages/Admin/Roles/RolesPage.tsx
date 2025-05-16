import React, { useEffect, useState } from 'react';
import { Rol } from '@/types/types/Rol';
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
} from '@/Api/RolService';
import DefaultLayout from '@/layouts/default';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

const initialForm: Rol = {
  nombreRol: '',
  fechaInicial: '',
  fechaFinal: '',
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      console.error('❌ Error al guardar rol:', error);
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
    <DefaultLayout>
      <div className="max-w-6xl mx-auto p-6 bg-slate-100 min-h-screen text-slate-800">
        <h1 className="text-3xl font-semibold mb-6 text-blue-800">Gestión de Roles</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-md mb-8"
        >
          <input
            type="text"
            name="nombreRol"
            placeholder="Nombre del Rol"
            value={form.nombreRol}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="fechaInicial"
            value={form.fechaInicial}
            onChange={handleChange}
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="fechaFinal"
            value={form.fechaFinal}
            onChange={handleChange}
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
              {editando ? 'Actualizar Rol' : 'Crear Rol'}
            </button>
          </div>
        </form>

        <div className="bg-white p-4 rounded-xl shadow-md overflow-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Nombre del Rol</th>
                <th className="px-4 py-2 border">Fecha Inicial</th>
                <th className="px-4 py-2 border">Fecha Final</th>
                <th className="px-4 py-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-2 border">{rol.id}</td>
                  <td className="px-4 py-2 border">{rol.nombreRol}</td>
                  <td className="px-4 py-2 border">{rol.fechaInicial?.split('T')[0]}</td>
                  <td className="px-4 py-2 border">{rol.fechaFinal?.split('T')[0]}</td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(rol)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition"
                        title="Editar"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rol.id!)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-slate-500">
                    No hay roles registrados.
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
