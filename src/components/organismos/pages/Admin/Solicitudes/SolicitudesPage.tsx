import React, { useEffect, useState } from "react";
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from "@/Api/Solicitudes";
import { Solicitud } from "@/types/types/Solicitud";
import DefaultLayout from "@/layouts/default";

const initialFormState: Omit<Solicitud, "id"> = {
  usuarioSolicitanteId: 0,
  fechaSolicitud: new Date().toISOString().slice(0, 16),
  estadoSolicitud: "Pendiente",
  fechaInicial: new Date().toISOString().slice(0, 16),
  fechaFinal: new Date().toISOString().slice(0, 16),
};

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [form, setForm] = useState<Omit<Solicitud, "id">>(initialFormState);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    const data = await getSolicitudes();
    setSolicitudes(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "usuarioSolicitanteId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId !== null) {
        await updateSolicitud(editandoId, form);
      } else {
        await createSolicitud(form);
      }
      setForm(initialFormState);
      setEditandoId(null);
      loadSolicitudes();
    } catch (error) {
      console.error("Error al guardar la solicitud:", error);
    }
  };

  const handleEdit = (solicitud: Solicitud) => {
    setForm({
      usuarioSolicitanteId: solicitud.usuarioSolicitanteId,
      fechaSolicitud: solicitud.fechaSolicitud.slice(0, 16),
      estadoSolicitud: solicitud.estadoSolicitud,
      fechaInicial: solicitud.fechaInicial.slice(0, 16),
      fechaFinal: solicitud.fechaFinal.slice(0, 16),
    });
    setEditandoId(solicitud.id!);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta solicitud?")) {
      await deleteSolicitud(id);
      loadSolicitudes();
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gestión de Solicitudes</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-8 bg-gray-100 p-6 rounded shadow"
        >
          <input
            type="number"
            name="usuarioSolicitanteId"
            placeholder="ID Usuario Solicitante"
            value={form.usuarioSolicitanteId}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="fechaSolicitud"
            value={form.fechaSolicitud}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="estadoSolicitud"
            placeholder="Estado de la Solicitud"
            value={form.estadoSolicitud}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="fechaInicial"
            value={form.fechaInicial}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="fechaFinal"
            value={form.fechaFinal}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editandoId ? "Actualizar Solicitud" : "Crear Solicitud"}
          </button>
        </form>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Usuario</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Fecha Inicial</th>
              <th className="border px-4 py-2">Fecha Final</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.id}</td>
                <td className="border px-4 py-2">{s.usuarioSolicitanteId}</td>
                <td className="border px-4 py-2">{s.estadoSolicitud}</td>
                <td className="border px-4 py-2">{s.fechaInicial}</td>
                <td className="border px-4 py-2">{s.fechaFinal}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="mr-2 text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(s.id!)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
