import React, { useEffect, useState } from "react";
import { Solicitud } from "@/types/types/Solicitud";
import { getSolicitudes, createSolicitud, updateSolicitud, deleteSolicitud } from "@/Api/Solicitudes";

export default function SolicitudesPage() {
  const [form, setForm] = useState<Solicitud>({
    productoId: 0,
    cantidad: 1,
    usuarioId: 0,
    fechaSolicitud: new Date().toISOString(),
    estado: "Pendiente",
  });

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    try {
      const data = await getSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error("Error cargando solicitudes", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "productoId" || name === "usuarioId" || name === "cantidad" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && form.id) {
        await updateSolicitud(form.id, form);
      } else {
        await createSolicitud(form);
      }
      setForm({
        productoId: 0,
        cantidad: 1,
        usuarioId: 0,
        fechaSolicitud: new Date().toISOString(),
        estado: "Pendiente",
      });
      setEditando(false);
      loadSolicitudes();
    } catch (error) {
      console.error("Error guardando solicitud", error);
    }
  };

  const handleEdit = (sol: Solicitud) => {
    setForm(sol);
    setEditando(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteSolicitud(id);
      loadSolicitudes();
    } catch (error) {
      console.error("Error eliminando solicitud", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Solicitudes</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input
          type="number"
          name="productoId"
          placeholder="ID Producto"
          value={form.productoId}
          onChange={handleChange}
          required
          min={1}
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={handleChange}
          required
          min={1}
        />
        <input
          type="number"
          name="usuarioId"
          placeholder="ID Usuario"
          value={form.usuarioId}
          onChange={handleChange}
          required
          min={1}
        />
        <input
          type="datetime-local"
          name="fechaSolicitud"
          value={form.fechaSolicitud.slice(0, 16)}
          onChange={handleChange}
          required
        />
        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
        </select>
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editando ? "Actualizar Solicitud" : "Crear Solicitud"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Producto ID</th>
            <th className="px-4 py-2 border">Cantidad</th>
            <th className="px-4 py-2 border">Usuario ID</th>
            <th className="px-4 py-2 border">Fecha Solicitud</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((sol) => (
            <tr key={sol.id}>
              <td className="px-4 py-2 border">{sol.id}</td>
              <td className="px-4 py-2 border">{sol.productoId}</td>
              <td className="px-4 py-2 border">{sol.cantidad}</td>
              <td className="px-4 py-2 border">{sol.usuarioId}</td>
              <td className="px-4 py-2 border">{new Date(sol.fechaSolicitud).toLocaleString()}</td>
              <td className="px-4 py-2 border">{sol.estado}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(sol)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => sol.id && handleDelete(sol.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {solicitudes.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No hay solicitudes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
