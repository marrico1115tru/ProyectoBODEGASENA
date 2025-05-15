import React, { useEffect, useState } from 'react';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '@/Api/Usuariosform';
import { Usuario } from '@/types/types/Usuario';

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
  fechaFinal: ''
};

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Usuario>(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      console.error("❌ Error al guardar usuario:", error);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required className="input" />
        <input type="text" name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} required className="input" />
        <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required className="input" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input" />
        <input type="text" name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} required className="input" />
        <input type="number" name="areaId" placeholder="Área ID" value={form.areaId} onChange={handleChange} required className="input" />
        <input type="number" name="fichaId" placeholder="Ficha ID" value={form.fichaId} onChange={handleChange} required className="input" />
        <input type="number" name="rolId" placeholder="Rol ID" value={form.rolId} onChange={handleChange} required className="input" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Cédula</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Rol ID</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.nombre} {u.apellido}</td>
              <td className="border px-2 py-1">{u.cedula}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">{u.rolId}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(u)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Editar</button>
                <button onClick={() => handleDelete(u.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
