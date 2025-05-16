// src/pages/AreasPage.tsx
import React, { useEffect, useState } from 'react';
import { Area } from '@/types/types/typesArea';
import {
  getAreas,
  createArea,
  updateArea,
  deleteArea
} from '@/Api/AreasService';

const initialFormState: Area = {
  nombre: '',
  centroFormacionId: 0,
  sitioId: 0,
  fechaInicial: '',
  fechaFinal: '',
};

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState<Area>(initialFormState);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    const data = await getAreas();
    setAreas(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
  
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar campos obligatorios básicos
      if (!form.nombre || form.centroFormacionId === 0 || form.sitioId === 0) {
        alert('Debe completar nombre, centroFormacionId y sitioId');
        return;
      }

      if (editando && idEditando !== null) {
        await updateArea(idEditando, form);
      } else {
        await createArea(form);
      }

      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      cargarAreas();
    } catch (error) {
      console.error('Error guardando área:', error);
    }
  };

  const handleEdit = (area: Area) => {
    setForm({
      nombre: area.nombre,
      centroFormacionId: area.centroFormacionId,
      sitioId: area.sitioId,
      fechaInicial: area.fechaInicial ? area.fechaInicial.slice(0, 10) : '',
      fechaFinal: area.fechaFinal ? area.fechaFinal.slice(0, 10) : '',
    });
    setEditando(true);
    setIdEditando(area.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta área?')) {
      await deleteArea(id);
      cargarAreas();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Áreas</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="number"
          name="centroFormacionId"
          placeholder="ID Centro Formación"
          value={form.centroFormacionId}
          onChange={handleChange}
          required
          className="input"
          min={1}
        />
        <input
          type="number"
          name="sitioId"
          placeholder="ID Sitio"
          value={form.sitioId}
          onChange={handleChange}
          required
          className="input"
          min={1}
        />
        <input
          type="date"
          name="fechaInicial"
          value={form.fechaInicial || ''}
          onChange={handleChange}
          className="input"
        />
        <input
          type="date"
          name="fechaFinal"
          value={form.fechaFinal || ''}
          onChange={handleChange}
          className="input"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editando ? 'Actualizar Área' : 'Crear Área'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Centro Formación ID</th>
            <th className="border px-2 py-1">Sitio ID</th>
            <th className="border px-2 py-1">Fecha Inicial</th>
            <th className="border px-2 py-1">Fecha Final</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr key={area.id}>
              <td className="border px-2 py-1">{area.id}</td>
              <td className="border px-2 py-1">{area.nombre}</td>
              <td className="border px-2 py-1">{area.centroFormacionId}</td>
              <td className="border px-2 py-1">{area.sitioId}</td>
              <td className="border px-2 py-1">{area.fechaInicial?.slice(0, 10)}</td>
              <td className="border px-2 py-1">{area.fechaFinal?.slice(0, 10)}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleEdit(area)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(area.id!)}
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
