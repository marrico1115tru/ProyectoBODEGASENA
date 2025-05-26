import { useEffect, useState } from "react";
import {
  getTiposSitio,
  createTipoSitio,
  updateTipoSitio,
  deleteTipoSitio,
} from "@/Api/Tipo_sitios";
import { TipoSitio } from "@/types/types/tipo_sitios";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";

const ALL_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "nombre", label: "Nombre" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "fechaFinalizacion", label: "Fecha Finalización" },
  { id: "acciones", label: "Acciones" },
];

export default function TiposSitioPage() {
  const [tiposSitio, setTiposSitio] = useState<TipoSitio[]>([]);
  const [filteredTipos, setFilteredTipos] = useState<TipoSitio[]>([]);
  const [form, setForm] = useState<Partial<TipoSitio>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.id)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getTiposSitio();
    setTiposSitio(data);
  };

  useEffect(() => {
    const filtered = tiposSitio.filter((t) =>
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTipos(filtered);
    setCurrentPage(1);
  }, [searchTerm, tiposSitio]);

  const handleSubmit = async () => {
    if (!form.nombre) return alert("El nombre es obligatorio");

    if (editingId) {
      await updateTipoSitio(editingId, form);
    } else {
      await createTipoSitio({
        ...form,
        fechaCreacion: new Date().toISOString(),
      });
    }
    setOpen(false);
    setForm({});
    setEditingId(null);
    fetchData();
  };

  const handleEdit = (tipo: TipoSitio) => {
    setForm(tipo);
    setEditingId(tipo.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este tipo de sitio?")) {
      await deleteTipoSitio(id);
      fetchData();
    }
  };

  const toggleColumn = (id: string) => {
    setVisibleColumns((cols) =>
      cols.includes(id) ? cols.filter((c) => c !== id) : [...cols, id]
    );
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filteredTipos.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredTipos.length / rowsPerPage);

  return (
    <DefaultLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🏷️ Tipos de Sitio</h1>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Columnas */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ALL_COLUMNS.map((col) => (
          <button
            key={col.id}
            onClick={() => toggleColumn(col.id)}
            className={`flex items-center px-3 py-1 rounded text-sm font-medium border ${
              visibleColumns.includes(col.id)
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {visibleColumns.includes(col.id) ? (
              <EyeIcon className="h-4 w-4 mr-1" />
            ) : (
              <EyeSlashIcon className="h-4 w-4 mr-1" />
            )}
            {col.label}
          </button>
        ))}
      </div>

      {/* Contador */}
      <div className="text-sm text-gray-600 mb-2">
        Total tipos de sitio: {filteredTipos.length}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100">
            <tr>
              {ALL_COLUMNS.map(
                (col) =>
                  visibleColumns.includes(col.id) && (
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
                  {visibleColumns.includes("id") && (
                    <td className="px-6 py-3">{t.id}</td>
                  )}
                  {visibleColumns.includes("nombre") && (
                    <td className="px-6 py-3">{t.nombre}</td>
                  )}
                  {visibleColumns.includes("fechaCreacion") && (
                    <td className="px-6 py-3">
                      {new Date(t.fechaCreacion).toLocaleDateString()}
                    </td>
                  )}
                  {visibleColumns.includes("fechaFinalizacion") && (
                    <td className="px-6 py-3">
                      {t.fechaFinalizacion
                        ? new Date(t.fechaFinalizacion).toLocaleDateString()
                        : "—"}
                    </td>
                  )}
                  {visibleColumns.includes("acciones") && (
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
                  colSpan={visibleColumns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No se encontraron tipos de sitio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Página {currentPage} de {totalPages || 1}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-bold">
              {editingId ? "Editar Tipo de Sitio" : "Crear Tipo de Sitio"}
            </Dialog.Title>

            <input
              type="text"
              placeholder="Nombre del tipo de sitio"
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
