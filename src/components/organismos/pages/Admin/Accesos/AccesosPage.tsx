import React, { useEffect, useState } from 'react';
import {
  getAccesos,
  createAcceso,
  updateAcceso,
  deleteAcceso,
} from '@/Api/accesosService';
import { getRoles } from '@/Api/RolService';
import { getOpciones } from '@/Api/OpcionesService';

import { Acceso } from '@/types/types/acceso';
import DefaultLayout from '@/layouts/default';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

type SimpleItem = {
  id: number;
  nombre: string;
};

const initialFormState: Omit<Acceso, 'id'> = {
  rolId: 0,
  opcionId: 0,
};

export default function AccesoView() {
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const [roles, setRoles] = useState<SimpleItem[]>([]);
  const [opciones, setOpciones] = useState<SimpleItem[]>([]);

  useEffect(() => {
    cargarAccesos();
    cargarDatosFormulario();
  }, []);

  const cargarAccesos = async () => {
    const data = await getAccesos();
    setAccesos(data);
  };

  const cargarDatosFormulario = async () => {
    try {
      const [rolesData, opcionesData] = await Promise.all([
        getRoles(),
        getOpciones(),
      ]);

      const rolesLimpios = rolesData.map((r: any) => ({
        id: r.id ?? 0,
        nombre: r.nombre ?? '',
      }));

      const opcionesLimpias = opcionesData.map((o: any) => ({
        id: o.id ?? 0,
        nombre: o.nombre ?? '',
      }));

      setRoles(rolesLimpios);
      setOpciones(opcionesLimpias);
    } catch (error) {
      console.error('Error al cargar roles u opciones:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateAcceso(idEditando, form);
      } else {
        await createAcceso(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarAccesos();
    } catch (error) {
      console.error('Error al guardar acceso:', error);
    }
  };

  const handleEdit = (acceso: Acceso) => {
    setForm({ opcionId: acceso.opcionId, rolId: acceso.rolId });
    setEditando(true);
    setIdEditando(acceso.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este acceso?')) {
      await deleteAcceso(id);
      cargarAccesos();
    }
  };

  const getNombreRol = (id: number) => {
    const rol = roles.find((r) => r.id === id);
    return rol?.nombre || `ID: ${id}`;
  };

  const getNombreOpcion = (id: number) => {
    const opcion = opciones.find((o) => o.id === id);
    return opcion?.nombre || `ID: ${id}`;
  };

  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto p-6 bg-slate-100 min-h-screen text-slate-800">
        <h1 className="text-3xl font-semibold mb-6 text-blue-800">Gestión de Accesos</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-md mb-8"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select
              name="rolId"
              value={form.rolId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Opción</label>
            <select
              name="opcionId"
              value={form.opcionId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione una opción</option>
              {opciones.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
              {editando ? 'Actualizar Acceso' : 'Crear Acceso'}
            </button>
          </div>
        </form>

        <div className="bg-white p-4 rounded-xl shadow-md overflow-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Rol</th>
                <th className="px-4 py-2 border">Opción</th>
                <th className="px-4 py-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accesos.map((acceso) => (
                <tr key={acceso.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-2 border">{acceso.id}</td>
                  <td className="px-4 py-2 border">{getNombreRol(acceso.rolId)}</td>
                  <td className="px-4 py-2 border">{getNombreOpcion(acceso.opcionId)}</td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(acceso)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition"
                        title="Editar"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(acceso.id!)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {accesos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-slate-500">
                    No hay accesos registrados.
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
