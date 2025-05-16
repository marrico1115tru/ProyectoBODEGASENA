import { useEffect, useState } from "react";
import {
  getAccesos,
  createAcceso,
  updateAcceso,
  deleteAcceso,
} from "@/Api/accesosService";
import { Acceso, AccesoInput } from "@/types/types/acceso";

export default function AccesosPage() {
  const [form, setForm] = useState<AccesoInput>({
    opcionId: 0,
    rolId: 0,
    fechaInicial: "",
    fechaFinal: "",
  });

  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [editando, setEditando] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadAccesos();
  }, []);

  const loadAccesos = async () => {
    const data = await getAccesos();
    setAccesos(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes("Id") ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editando && editId !== null) {
      await updateAcceso(editId, form);
    } else {
      await createAcceso(form);
    }
    setForm({
      opcionId: 0,
      rolId: 0,
      fechaInicial: "",
      fechaFinal: "",
    });
    setEditando(false);
    setEditId(null);
    await loadAccesos();
  };

  const handleEdit = (acceso: Acceso) => {
    setForm({
      opcionId: acceso.opcionId,
      rolId: acceso.rolId,
      fechaInicial: acceso.fechaInicial,
      fechaFinal: acceso.fechaFinal,
    });
    setEditando(true);
    setEditId(acceso.id);
  };

  const handleDelete = async (id: number) => {
    await deleteAcceso(id);
    await loadAccesos();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Accesos</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded shadow"
      >
        <input
          type="number"
          name="opcionId"
          placeholder="Opción ID"
          value={form.opcionId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rolId"
          placeholder="Rol ID"
          value={form.rolId}
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
          className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {editando ? "Actualizar Acceso" : "Crear Acceso"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Opción</th>
            <th className="px-4 py-2 border">Rol</th>
            <th className="px-4 py-2 border">Fecha Inicial</th>
            <th className="px-4 py-2 border">Fecha Final</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accesos.map((a) => (
            <tr key={a.id}>
              <td className="border px-4 py-2">{a.opcion?.nombre || a.opcionId}</td>
              <td className="border px-4 py-2">{a.rol?.nombre || a.rolId}</td>
              <td className="border px-4 py-2">{a.fechaInicial}</td>
              <td className="border px-4 py-2">{a.fechaFinal}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-blue-600 hover:underline mr-2"
                  onClick={() => handleEdit(a)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(a.id)}
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
