import { useEffect, useState } from "react";
import {
  CentroFormacion,
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from "@/Api/centrosformacionTable";

export default function CentroFormacionPage() {
  const [form, setForm] = useState<CentroFormacion>({
    nombre: "",
    ubicacion: "",
    telefono: "",
    email: "",
    fechaInicial: "",
    fechaFinal: "",
  });

  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    cargarCentros();
  }, []);

  const cargarCentros = async () => {
    const data = await getCentrosFormacion();
    console.log("[TEST] cargarCentros:", data);
    setCentros(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    let newValue = value;
  
    if (name === "fechaInicial" || name === "fechaFinal") {
      const date = new Date(value);
      newValue = date.toISOString(); // formato ISO: "2025-01-01T00:00:00.000Z"
    }
  
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editando && form.id) {
        await updateCentroFormacion(form.id, form);
      } else {
        await createCentroFormacion(form);
      }

      await cargarCentros();

      setForm({
        nombre: "",
        ubicacion: "",
        telefono: "",
        email: "",
        fechaInicial: "",
        fechaFinal: "",
      });
      setEditando(false);
    } catch (error) {
      console.error("Error al guardar centro:", error);
    }
  };

  const handleEdit = (centro: CentroFormacion) => {
    setForm(centro);
    setEditando(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await deleteCentroFormacion(id);
    await cargarCentros();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Centros de Formación</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded shadow"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="fechaInicial"
          value={form.fechaInicial ? form.fechaInicial.slice(0, 16) : ''}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="fechaFinal"
          value={form.fechaFinal ? form.fechaFinal.slice(0, 16) : ''}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editando ? "Actualizar Centro" : "Crear Centro"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Ubicación</th>
            <th className="px-4 py-2 border">Teléfono</th>
            <th className="px-4 py-2 border">Correo</th>
            <th className="px-4 py-2 border">Fecha Inicial</th>
            <th className="px-4 py-2 border">Fecha Final</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {centros.map((centro) => (
            <tr key={centro.id}>
              <td className="px-4 py-2 border">{centro.nombre}</td>
              <td className="px-4 py-2 border">{centro.ubicacion}</td>
              <td className="px-4 py-2 border">{centro.telefono}</td>
              <td className="px-4 py-2 border">{centro.email}</td>
              <td className="px-4 py-2 border">{centro.fechaInicial}</td>
              <td className="px-4 py-2 border">{centro.fechaFinal}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(centro)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(centro.id)}
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
  );
}
