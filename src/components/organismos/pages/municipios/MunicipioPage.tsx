import React, { useEffect, useState } from 'react';
import {
  getMunicipios,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio
} from '@/Api/MunicipiosForm';
import { Municipio } from '@/types/types/typesMunicipio';

const initialFormState: Municipio = {
  nombre: '',
  departamento: '',
  centroFormacionId: 1,
  fechaInicial: '',
  fechaFinal: ''
};

export default function MunicipioPage() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [form, setForm] = useState<Municipio>(initialFormState);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarMunicipios();
  }, []);

  const cargarMunicipios = async () => {
    const data = await getMunicipios();
    setMunicipios(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateMunicipio(idEditando, form);
      } else {
        await createMunicipio(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarMunicipios();
    } catch (error) {
      console.error("❌ Error al guardar municipio:", error);
    }
  };

  const handleEdit = (municipio: Municipio) => {
    setForm(municipio);
    setEditando(true);
    setIdEditando(municipio.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este municipio?')) {
      await deleteMunicipio(id);
      cargarMunicipios();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Municipios</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded shadow">
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <input type="text" name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} required className="input" />
        <input type="number" name="centroFormacionId" placeholder="Centro Formación ID" value={form.centroFormacionId} onChange={handleChange} required className="input" />
        <input type="date" name="fechaInicial" value={form.fechaInicial} onChange={handleChange} className="input" />
        <input type="date" name="fechaFinal" value={form.fechaFinal} onChange={handleChange} className="input" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Municipio' : 'Crear Municipio'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Departamento</th>
            <th className="border px-2 py-1">Centro Formación ID</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {municipios.map((m) => (
            <tr key={m.id}>
              <td className="border px-2 py-1">{m.id}</td>
              <td className="border px-2 py-1">{m.nombre}</td>
              <td className="border px-2 py-1">{m.departamento}</td>
              <td className="border px-2 py-1">{m.centroFormacionId}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(m)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 mr-2 rounded">Editar</button>
                <button onClick={() => handleDelete(m.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
