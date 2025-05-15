import React, { useEffect, useState } from 'react';
import { getSedes, createSede, updateSede, deleteSede } from '@/Api/SedesService';
import { Sede } from '@/types/types/Sede';

const initialForm: Sede = {
  nombre: '',
  ubicacion: '',
  areaId: 1,
  centroId: 1,
  fechaInicial: '',
  fechaFinal: ''
};

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [form, setForm] = useState<Sede>(initialForm);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarSedes();
  }, []);

  const cargarSedes = async () => {
    const data = await getSedes();
    setSedes(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateSede(idEditando, form);
      } else {
        await createSede(form);
      }
      setForm(initialForm);
      setEditando(false);
      setIdEditando(null);
      cargarSedes();
    } catch (error) {
      console.error("❌ Error al guardar sede:", error);
    }
  };

  const handleEdit = (sede: Sede) => {
    setForm(sede);
    setEditando(true);
    setIdEditando(sede.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta sede?')) {
      await deleteSede(id);
      cargarSedes();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Sedes</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded shadow mb-6">
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <input type="text" name="ubicacion" placeholder="Ubicación" value={form.ubicacion} onChange={handleChange} required className="input" />
        <input type="number" name="areaId" placeholder="Área ID" value={form.areaId} onChange={handleChange} required className="input" />
        <input type="number" name="centroId" placeholder="Centro ID" value={form.centroId} onChange={handleChange} required className="input" />
        <input type="date" name="fechaInicial" placeholder="Fecha Inicial" value={form.fechaInicial} onChange={handleChange} required className="input" />
        <input type="date" name="fechaFinal" placeholder="Fecha Final" value={form.fechaFinal} onChange={handleChange} required className="input" />

        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Sede' : 'Crear Sede'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Ubicación</th>
            <th className="border px-2 py-1">Área</th>
            <th className="border px-2 py-1">Centro</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sedes.map((sede) => (
            <tr key={sede.id}>
              <td className="border px-2 py-1">{sede.id}</td>
              <td className="border px-2 py-1">{sede.nombre}</td>
              <td className="border px-2 py-1">{sede.ubicacion}</td>
              <td className="border px-2 py-1">{sede.areaId}</td>
              <td className="border px-2 py-1">{sede.centroId}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(sede)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Editar</button>
                <button onClick={() => handleDelete(sede.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
