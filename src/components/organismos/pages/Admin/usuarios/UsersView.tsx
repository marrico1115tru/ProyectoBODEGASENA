import React, { useEffect, useState } from 'react';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '@/Api/Usuariosform';
import { getAreas } from '@/Api/AreasService';
import { getRoles } from '@/Api/RolService';
import { getFichasFormacion } from '@/Api/fichasFormacion';

import { Usuario } from '@/types/types/Usuario';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import DefaultLayout from '@/layouts/default';

const initialFormState: Usuario = {
  nombre: '',
  apellido: '',
  cedula: '',
  telefono: '',
  email: '',
  cargo: '',
  areaId: 1,
  fichaId: 1,
  rolId: 1,
  fechaInicial: '',
  fechaFinal: '',
};

type SimpleItem = {
  id: number;
  nombre: string;
};

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Usuario>(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  // Cambié el tipo a SimpleItem[], que asegura id:number y nombre:string
  const [areas, setAreas] = useState<SimpleItem[]>([]);
  const [roles, setRoles] = useState<SimpleItem[]>([]);
  const [fichas, setFichas] = useState<SimpleItem[]>([]);

  useEffect(() => {
    cargarUsuarios();
    cargarDatosForm();
  }, []);

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const cargarDatosForm = async () => {
    try {
      const [areasData, rolesData, fichasData] = await Promise.all([
        getAreas(),
        getRoles(),
        getFichasFormacion(),
      ]);

      // Mapear para asegurar id:number (sin undefined)
      const areasLimpias = areasData.map((a: any) => ({
        id: a.id ?? 0,
        nombre: a.nombre ?? '',
      }));

      const rolesLimpios = rolesData.map((r: any) => ({
        id: r.id ?? 0,
        nombre: r.nombre ?? '',
      }));

      const fichasLimpias = fichasData.map((f: any) => ({
        id: f.id ?? 0,
        nombre: f.nombre ?? '',
      }));

      setAreas(areasLimpias);
      setRoles(rolesLimpios);
      setFichas(fichasLimpias);
    } catch (error) {
      console.error('Error cargando datos del formulario:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateUsuario(idEditando, form);
      } else {
        await createUsuario(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarUsuarios();
    } catch (error) {
      console.error('❌ Error al guardar usuario:', error);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setForm(usuario);
    setEditando(true);
    setIdEditando(usuario.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUsuario(id);
      cargarUsuarios();
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto p-6 bg-slate-100 min-h-screen text-slate-800">
        <h1 className="text-3xl font-semibold mb-6 text-blue-800">Gestión de Usuarios</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-md mb-8"
        >
          {[
            { name: 'nombre', placeholder: 'Nombre' },
            { name: 'apellido', placeholder: 'Apellido' },
            { name: 'cedula', placeholder: 'Cédula' },
            { name: 'telefono', placeholder: 'Teléfono' },
            { name: 'email', placeholder: 'Email', type: 'email' },
            { name: 'cargo', placeholder: 'Cargo' },
          ].map(({ name, placeholder, type = 'text' }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={form[name as keyof Usuario] as string | number}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <select
            name="areaId"
            value={form.areaId}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione Área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>

          <select
            name="fichaId"
            value={form.fichaId}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione Ficha</option>
            {fichas.map((ficha) => (
              <option key={ficha.id} value={ficha.id}>
                {ficha.nombre}
              </option>
            ))}
          </select>

          <select
            name="rolId"
            value={form.rolId}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione Rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
              {editando ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </div>
        </form>

        <div className="bg-white p-4 rounded-xl shadow-md overflow-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Cédula</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Rol</th>
                <th className="px-4 py-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-2 border">{u.id}</td>
                  <td className="px-4 py-2 border">{u.nombre} {u.apellido}</td>
                  <td className="px-4 py-2 border">{u.cedula}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{roles.find(r => r.id === u.rolId)?.nombre || u.rolId}</td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition"
                        title="Editar"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id!)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-slate-500">
                    No hay usuarios registrados.
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
