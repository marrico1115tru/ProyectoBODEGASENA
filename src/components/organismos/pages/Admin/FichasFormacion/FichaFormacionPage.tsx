import { useEffect, useState } from "react";
import {
  getFichasFormacion,
  createFichaFormacion,
  updateFichaFormacion,
  deleteFichaFormacion,
} from "@/Api/fichasFormacion";
import { FichaFormacion } from "@/types/types/FichaFormacion";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export default function FichasFormacionPage() {
  const [fichas, setFichas] = useState<FichaFormacion[]>([]);
  const [formData, setFormData] = useState<Partial<FichaFormacion>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFichas();
  }, []);

  const fetchFichas = async () => {
    const data = await getFichasFormacion();
    setFichas(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.idTitulado) {
      alert("Nombre y Titulado son obligatorios.");
      return;
    }
    if (editId) {
      await updateFichaFormacion(editId, {
        nombre: formData.nombre,
        idTitulado: formData.idTitulado,
      });
    } else {
      await createFichaFormacion({
        nombre: formData.nombre,
        idTitulado: formData.idTitulado,
      });
    }
    setFormData({});
    setEditId(null);
    setShowForm(false);
    fetchFichas();
  };

  const handleEdit = (ficha: FichaFormacion) => {
    setFormData({
      nombre: ficha.nombre,
      idTitulado: ficha.idTitulado,
    });
    setEditId(ficha.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta ficha de formación?")) {
      await deleteFichaFormacion(id);
      fetchFichas();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Fichas de Formación</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center"
          onClick={() => {
            setFormData({});
            setEditId(null);
            setShowForm(true);
          }}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Ficha
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <input
            type="text"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre de la ficha"
            className="w-full border p-2 rounded mb-2"
            required
          />
          {/* Este campo solo es ilustrativo, debe convertirse en select dinámico si se implementan titulados */}
          <input
            type="number"
            name="idTitulado"
            placeholder="ID Titulado"
            value={(formData.idTitulado as any)?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                idTitulado: { id: Number(e.target.value), nombre: "" },
              })
            }
            className="w-full border p-2 rounded mb-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
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
              <th className="px-4 py-2">Titulado</th>
              <th className="px-4 py-2">Responsable</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fichas.map((ficha) => (
              <tr key={ficha.id} className="border-t">
                <td className="px-4 py-2">{ficha.id}</td>
                <td className="px-4 py-2">{ficha.nombre}</td>
                <td className="px-4 py-2">{ficha.idTitulado?.nombre}</td>
                <td className="px-4 py-2">
                  {ficha.idUsuarioResponsable
                    ? `${ficha.idUsuarioResponsable.nombre} ${ficha.idUsuarioResponsable.apellido ?? ""}`
                    : "Sin responsable"}
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => handleEdit(ficha)}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(ficha.id)}
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
