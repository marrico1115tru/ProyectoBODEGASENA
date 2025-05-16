import React, { useEffect, useState } from "react";
import { Sede } from "@/types/types/Sede";
import {
  getSedes,
  createSede,
  updateSede,
  deleteSede,
} from "@/Api/SedesService";

const initialFormState: Omit<Sede, "id"> = {
  nombre: "",
  ubicacion: "",
  areaId: 0,
  centroId: 0,
  fechaInicial: new Date().toISOString().slice(0, 16),
  fechaFinal: new Date().toISOString().slice(0, 16),
};

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [form, setForm] = useState<Omit<Sede, "id">>(initialFormState);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar sedes al iniciar
  useEffect(() => {
    loadSedes();
  }, []);

  const loadSedes = async () => {
    setLoading(true);
    try {
      const data = await getSedes();
      setSedes(data);
    } catch (error) {
      alert("Error cargando sedes");
    }
    setLoading(false);
  };

  // Manejar inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "areaId" || name === "centroId" ? Number(value) : value,
    }));
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId !== null) {
        // actualizar
        await updateSede(editandoId, form);
        setSedes((prev) =>
          prev.map((s) => (s.id === editandoId ? { ...form, id: editandoId } : s))
        );
      } else {
        // crear
        const nueva = await createSede(form);
        setSedes((prev) => [...prev, nueva]);
      }
      setForm(initialFormState);
      setEditandoId(null);
    } catch (error) {
      alert("Error guardando sede");
    }
  };

  // Editar
  const handleEdit = (sede: Sede) => {
    setForm({
      nombre: sede.nombre,
      ubicacion: sede.ubicacion,
      areaId: sede.areaId,
      centroId: sede.centroId,
      fechaInicial: sede.fechaInicial.slice(0, 16),
      fechaFinal: sede.fechaFinal.slice(0, 16),
    });
    setEditandoId(sede.id);
  };

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta sede?")) return;
    try {
      await deleteSede(id);
      setSedes((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Error eliminando sede");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestión de Sedes</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8 bg-gray-100 p-6 rounded shadow">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="areaId"
          placeholder="ID Área"
          value={form.areaId}
          onChange={handleChange}
          required
          min={1}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="centroId"
          placeholder="ID Centro Formación"
          value={form.centroId}
          onChange={handleChange}
          required
          min={1}
          className="border p-2 rounded"
        />
        <label>
          Fecha Inicial:
          <input
            type="datetime-local"
            name="fechaInicial"
            value={form.fechaInicial}
            onChange={handleChange}
            required
            className="border p-2 rounded mt-1 block"
          />
        </label>
        <label>
          Fecha Final:
          <input
            type="datetime-local"
            name="fechaFinal"
            value={form.fechaFinal}
            onChange={handleChange}
            required
            className="border p-2 rounded mt-1 block"
          />
        </label>
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editandoId ? "Actualizar Sede" : "Crear Sede"}
        </button>
      </form>

      {loading ? (
        <p>Cargando sedes...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Ubicación</th>
              <th className="border px-4 py-2">ID Área</th>
              <th className="border px-4 py-2">ID Centro</th>
              <th className="border px-4 py-2">Fecha Inicial</th>
              <th className="border px-4 py-2">Fecha Final</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sedes.map((sede) => (
              <tr key={sede.id}>
                <td className="border px-4 py-2">{sede.nombre}</td>
                <td className="border px-4 py-2">{sede.ubicacion}</td>
                <td className="border px-4 py-2">{sede.areaId}</td>
                <td className="border px-4 py-2">{sede.centroId}</td>
                <td className="border px-4 py-2">{new Date(sede.fechaInicial).toLocaleString()}</td>
                <td className="border px-4 py-2">{new Date(sede.fechaFinal).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(sede)}
                    className="mr-2 text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(sede.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {sedes.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No hay sedes registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
