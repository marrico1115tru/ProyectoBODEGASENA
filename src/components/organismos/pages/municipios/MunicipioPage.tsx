import { useEffect, useState } from "react";
import {
  getMunicipios,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
} from "@/Api/MunicipiosForm";
import { Municipio } from "@/types/types/typesMunicipio";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function MunicipioPage() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Municipio>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    const data = await getMunicipios();
    setMunicipios(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await updateMunicipio(editingId, form);
    } else {
      await createMunicipio({ ...form, fechaCreacion: new Date().toISOString() });
    }
    setOpen(false);
    setForm({});
    setEditingId(null);
    fetchData();
  };

  const handleEdit = (municipio: Municipio) => {
    setForm(municipio);
    setEditingId(municipio.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este municipio?")) {
      await deleteMunicipio(id);
      fetchData();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🌍 Gestión de Municipios</h1>
        <button
          onClick={() => {
            setForm({});
            setEditingId(null);
            setOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Crear
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700 text-left">ID</th>
              <th className="px-6 py-3 font-semibold text-gray-700 text-left">Nombre</th>
              <th className="px-6 py-3 font-semibold text-gray-700 text-left">Departamento</th>
              <th className="px-6 py-3 font-semibold text-gray-700 text-left">Fecha Creación</th>
              <th className="px-6 py-3 font-semibold text-gray-700 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {municipios.length > 0 ? (
              municipios.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{m.id}</td>
                  <td className="px-6 py-3">{m.nombre}</td>
                  <td className="px-6 py-3">{m.departamento}</td>
                  <td className="px-6 py-3">{new Date(m.fechaCreacion).toLocaleDateString()}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Editar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No hay municipios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-6">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingId ? "Editar Municipio" : "Crear Municipio"}
            </DialogTitle>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre del municipio"
                  value={form.nombre || ""}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Departamento</label>
                <input
                  type="text"
                  placeholder="Departamento"
                  value={form.departamento || ""}
                  onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Guardar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </DefaultLayout>
  );
}
