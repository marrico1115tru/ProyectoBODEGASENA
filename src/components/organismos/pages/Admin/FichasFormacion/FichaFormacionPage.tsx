import { useEffect, useState } from "react";

interface Ficha {
  id: number;
  nombre: string;
  tituloId: number;
  fechaInicial: string;
  fechaFinal: string;
}

export default function FichaFormacionPage() {
  const [form, setForm] = useState<Ficha>({
    id: 0,
    nombre: "",
    tituloId: 0,
    fechaInicial: "",
    fechaFinal: "",
  });

  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    // Aquí puedes cargar las fichas desde tu API si la tienes
    // Por ahora lo dejamos vacío
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tituloId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editando) {
      // Actualizar ficha
      setFichas((prev) =>
        prev.map((f) => (f.id === form.id ? form : f))
      );
    } else {
      // Crear nueva ficha
      const nuevaFicha = { ...form, id: Date.now() };
      setFichas((prev) => [...prev, nuevaFicha]);
    }
    setForm({
      id: 0,
      nombre: "",
      tituloId: 0,
      fechaInicial: "",
      fechaFinal: "",
    });
    setEditando(false);
  };

  const handleEdit = (ficha: Ficha) => {
    setForm(ficha);
    setEditando(true);
  };

  const handleDelete = async (id: number) => {
    setFichas((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Fichas de Formación</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow"
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
          type="number"
          name="tituloId"
          placeholder="Título ID"
          value={form.tituloId}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="fechaInicial"
          value={form.fechaInicial.slice(0, 16)}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="fechaFinal"
          value={form.fechaFinal.slice(0, 16)}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editando ? "Actualizar Ficha" : "Crear Ficha"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Título ID</th>
            <th className="px-4 py-2 border">Fecha Inicial</th>
            <th className="px-4 py-2 border">Fecha Final</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fichas.map((ficha) => (
            <tr key={ficha.id}>
              <td className="px-4 py-2 border">{ficha.nombre}</td>
              <td className="px-4 py-2 border">{ficha.tituloId}</td>
              <td className="px-4 py-2 border">{ficha.fechaInicial}</td>
              <td className="px-4 py-2 border">{ficha.fechaFinal}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(ficha)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(ficha.id)}
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
