// src/pages/MunicipioPage.tsx
import React, { useEffect, useState } from "react";
import { Municipio } from "@/types/types/typesMunicipio";
import {
  getMunicipios,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
} from "@/Api/MunicipiosForm";
import DefaultLayout from "@/layouts/default";

export default function MunicipioPage() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [form, setForm] = useState<Omit<Municipio, "id">>({
    nombre: "",
    departamento: "",
    centroFormacionId: 0,
    fechaInicial: "",
    fechaFinal: "",
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarMunicipios();
  }, []);

  const cargarMunicipios = async () => {
    setCargando(true);
    try {
      const data = await getMunicipios();
      setMunicipios(data);
    } catch (error) {
      alert("Error cargando municipios");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "centroFormacionId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.nombre.trim() ||
      !form.departamento.trim() ||
      !form.fechaInicial ||
      !form.fechaFinal ||
      !form.centroFormacionId
    ) {
      alert("Completa todos los campos");
      return;
    }

    try {
      if (editandoId !== null) {
        // Editar municipio
        const municipioActualizado = await updateMunicipio(editandoId, form);
        setMunicipios((prev) =>
          prev.map((m) => (m.id === editandoId ? municipioActualizado : m))
        );
        setEditandoId(null);
      } else {
        // Crear municipio
        const nuevoMunicipio = await createMunicipio(form);
        setMunicipios((prev) => [...prev, nuevoMunicipio]);
      }
      // Resetear formulario
      setForm({
        nombre: "",
        departamento: "",
        centroFormacionId: 0,
        fechaInicial: "",
        fechaFinal: "",
      });
    } catch (error) {
      alert("Error al guardar municipio");
      console.error(error);
    }
  };

  const handleEditarClick = (municipio: Municipio) => {
    setEditandoId(municipio.id);
    setForm({
      nombre: municipio.nombre,
      departamento: municipio.departamento,
      centroFormacionId: municipio.centroFormacionId ?? 0,
      fechaInicial: municipio.fechaInicial
        ? municipio.fechaInicial.slice(0, 16)
        : "",
      fechaFinal: municipio.fechaFinal ? municipio.fechaFinal.slice(0, 16) : "",
    });
  };

  const handleEliminarClick = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este municipio?")) return;
    try {
      await deleteMunicipio(id);
      setMunicipios((prev) => prev.filter((m) => m.id !== id));
      if (editandoId === id) {
        setEditandoId(null);
        setForm({
          nombre: "",
          departamento: "",
          centroFormacionId: 0,
          fechaInicial: "",
          fechaFinal: "",
        });
      }
    } catch (error) {
      alert("Error al eliminar municipio");
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Gestión de Municipios</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded shadow"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="departamento"
            placeholder="Departamento"
            value={form.departamento}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="centroFormacionId"
            placeholder="Centro Formación ID"
            value={form.centroFormacionId || ""}
            onChange={handleChange}
            required
            min={1}
            className="border px-3 py-2 rounded"
          />
          <input
            type="datetime-local"
            name="fechaInicial"
            value={form.fechaInicial}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="datetime-local"
            name="fechaFinal"
            value={form.fechaFinal}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editandoId !== null ? "Actualizar Municipio" : "Crear Municipio"}
          </button>
        </form>

        {cargando ? (
          <p>Cargando municipios...</p>
        ) : (
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Departamento</th>
                <th className="px-4 py-2 border">Centro Formación ID</th>
                <th className="px-4 py-2 border">Fecha Inicial</th>
                <th className="px-4 py-2 border">Fecha Final</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {municipios.map((m) => (
                <tr key={m.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{m.nombre}</td>
                  <td className="px-4 py-2 border">{m.departamento}</td>
                  <td className="px-4 py-2 border">{m.centroFormacionId}</td>
                  <td className="px-4 py-2 border">
                    {m.fechaInicial
                      ? new Date(m.fechaInicial).toLocaleString()
                      : ""}
                  </td>
                  <td className="px-4 py-2 border">
                    {m.fechaFinal ? new Date(m.fechaFinal).toLocaleString() : ""}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEditarClick(m)}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarClick(m.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {municipios.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500"
                  >
                    No hay municipios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </DefaultLayout>
  );
}
