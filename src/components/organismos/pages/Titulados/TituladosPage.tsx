import { useEffect, useState } from "react";
import {
  getTitulados,
  createTitulado,
  updateTitulado,
  deleteTitulado,
} from "@/Api/TituladosService";
import { Titulado } from "@/types/types/typesTitulados";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export default function TituladosPage() {
  const [titulados, setTitulados] = useState<Titulado[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Titulado>>({});
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchTitulados();
  }, []);

  const fetchTitulados = async () => {
    const data = await getTitulados();
    setTitulados(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateTitulado(editId, formData);
    } else {
      await createTitulado(formData);
    }
    setFormData({});
    setEditId(null);
    setShowForm(false);
    fetchTitulados();
  };

  const handleEdit = (titulado: Titulado) => {
    setEditId(titulado.id);
    setFormData(titulado);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este titulado?")) {
      await deleteTitulado(id);
      fetchTitulados();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Titulados</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({});
            setEditId(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Titulado
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <input
            type="text"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre del titulado"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {titulados.map((titulado) => (
              <tr key={titulado.id} className="border-t">
                <td className="px-4 py-2">{titulado.id}</td>
                <td className="px-4 py-2">{titulado.nombre}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(titulado)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(titulado.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
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
