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
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";

/* ─── columnas de la tabla ─── */
const ALL_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "nombre", label: "Nombre" },
  { id: "fechaCreacion", label: "Creación" },
  { id: "fechaFinalizacion", label: "Finalización" },
  { id: "acciones", label: "Acciones" },
];

export default function TituladosPage() {
  const [titulados, setTitulados] = useState<Titulado[]>([]);
  const [filteredTitulados, setFilteredTitulados] = useState<Titulado[]>([]);
  const [search, setSearch] = useState("");
  const [visibleCols, setVisibleCols] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.id)
  );

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Titulado>>({});

  const [page, setPage] = useState(1);
  const rows = 5;

  useEffect(() => {
    fetchTitulados();
  }, []);

  const fetchTitulados = async () => {
    const data = await getTitulados();
    setTitulados(data);
  };

  useEffect(() => {
    const filtered = titulados.filter((t) =>
      `${t.nombre}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredTitulados(filtered);
    setPage(1);
  }, [search, titulados]);

  const handleSubmit = async () => {
    if (!form.nombre) return alert("Nombre es requerido");

    if (editingId) {
      await updateTitulado(editingId, form);
    } else {
      await createTitulado({
        ...form,
        fechaCreacion: new Date().toISOString(),
      });
    }
    setOpen(false);
    setForm({});
    setEditingId(null);
    fetchTitulados();
  };

  const handleEdit = (titulado: Titulado) => {
    setForm(titulado);
    setEditingId(titulado.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este titulado?")) {
      await deleteTitulado(id);
      fetchTitulados();
    }
  };

  const toggleColumn = (id: string) => {
    setVisibleCols((cols) =>
      cols.includes(id) ? cols.filter((c) => c !== id) : [...cols, id]
    );
  };

  const start = (page - 1) * rows;
  const paginated = filteredTitulados.slice(start, start + rows);
  const totalPages = Math.ceil(filteredTitulados.length / rows);

  return (
    <DefaultLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🎓 Gestión de Titulados</h1>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setForm({});
              setEditingId(null);
              setOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear
          </button>
        </div>
      </div>

      {/* Botones de columnas */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ALL_COLUMNS.map((col) => (
          <button
            key={col.id}
            onClick={() => toggleColumn(col.id)}
            className={`flex items-center px-3 py-1 rounded text-sm font-medium border ${
              visibleCols.includes(col.id)
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {visibleCols.includes(col.id) ? (
              <EyeIcon className="h-4 w-4 mr-1" />
            ) : (
              <EyeSlashIcon className="h-4 w-4 mr-1" />
            )}
            {col.label}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600 mb-2">
        Total titulados: {filteredTitulados.length}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100">
            <tr>
              {ALL_COLUMNS.map(
                (col) =>
                  visibleCols.includes(col.id) && (
                    <th
                      key={col.id}
                      className="px-6 py-3 text-left font-semibold"
                    >
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length > 0 ? (
              paginated.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  {visibleCols.includes("id") && (
                    <td className="px-6 py-3">{t.id}</td>
                  )}
                  {visibleCols.includes("nombre") && (
                    <td className="px-6 py-3">{t.nombre}</td>
                  )}
                  {visibleCols.includes("fechaCreacion") && (
                    <td className="px-6 py-3">
                      {new Date(t.fechaCreacion).toLocaleDateString()}
                    </td>
                  )}
                  {visibleCols.includes("fechaFinalizacion") && (
                    <td className="px-6 py-3">
                      {t.fechaFinalizacion
                        ? new Date(t.fechaFinalizacion).toLocaleDateString()
                        : "No registrada"}
                    </td>
                  )}
                  {visibleCols.includes("acciones") && (
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleCols.length}
                  className="text-center py-6 text-gray-500"
                >
                  No se encontraron titulados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Página {page} de {totalPages || 1}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${
              page === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded border ${
              page === totalPages || totalPages === 0
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-bold">
              {editingId ? "Editar Titulado" : "Crear Titulado"}
            </Dialog.Title>

            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre || ""}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </DefaultLayout>
  );
}