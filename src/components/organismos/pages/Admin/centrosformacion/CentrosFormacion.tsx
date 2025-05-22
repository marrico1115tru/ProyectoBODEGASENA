import { useEffect, useState } from "react";
import {
  getCentrosFormacion,
  createCentroFormacion,
  updateCentroFormacion,
  deleteCentroFormacion,
} from "@/Api/centrosformacionTable";
import { CentroFormacion } from "@/types/types/typesCentroFormacion";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

const ALL_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "nombre", label: "Nombre" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "telefono", label: "Teléfono" },
  { id: "email", label: "Email" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "acciones", label: "Acciones" },
];

export default function CentroFormacionPage() {
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [filteredCentros, setFilteredCentros] = useState<CentroFormacion[]>([]);
  const [form, setForm] = useState<Partial<CentroFormacion>>({});
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
    const data = await getCentrosFormacion();
    setCentros(data);
  };

  useEffect(() => {
    const filtered = centros.filter((c) =>
      `${c.nombre} ${c.ubicacion} ${c.telefono} ${c.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCentros(filtered);
    setCurrentPage(1);
  }, [searchTerm, centros]);

  const handleSubmit = async () => {
    if (editingId) {
      await updateCentroFormacion(editingId, form);
    } else {
      await createCentroFormacion({
        ...form,
        fechaCreacion: new Date().toISOString(),
      });
    }
    setOpen(false);
    setForm({});
    setEditingId(null);
    fetchData();
  };

  const handleEdit = (centro: CentroFormacion) => {
    setForm(centro);
    setEditingId(centro.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este centro de formación?")) {
      await deleteCentroFormacion(id);
      fetchData();
    }
  };

  const toggleColumn = (id: string) => {
    setVisibleColumns((cols) =>
      cols.includes(id) ? cols.filter((c) => c !== id) : [...cols, id]
    );
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filteredCentros.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredCentros.length / rowsPerPage);

  return (
    <DefaultLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          🏫 Gestión de Centros de Formación
        </h1>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre, ubicación, teléfono o email..."
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

      {/* Filtros de columnas */}
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
        Total centros de formación: {filteredCentros.length}
      </div>

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
              paginated.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  {visibleColumns.includes("id") && (
                    <td className="px-6 py-3">{c.id}</td>
                  )}
                  {visibleColumns.includes("nombre") && (
                    <td className="px-6 py-3">{c.nombre}</td>
                  )}
                  {visibleColumns.includes("ubicacion") && (
                    <td className="px-6 py-3">{c.ubicacion}</td>
                  )}
                  {visibleColumns.includes("telefono") && (
                    <td className="px-6 py-3">{c.telefono}</td>
                  )}
                  {visibleColumns.includes("email") && (
                    <td className="px-6 py-3">{c.email}</td>
                  )}
                  {visibleColumns.includes("fechaCreacion") && (
                    <td className="px-6 py-3">
                      {new Date(c.fechaCreacion).toLocaleDateString()}
                    </td>
                  )}
                  {visibleColumns.includes("acciones") && (
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
                  No se encontraron centros de formación.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Modal simple para crear/editar */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Editar Centro de Formación" : "Crear Centro de Formación"}
            </h2>

            <label className="block mb-2 font-medium">Nombre</label>
            <input
              type="text"
              value={form.nombre || ""}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-3"
            />

            <label className="block mb-2 font-medium">Ubicación</label>
            <input
              type="text"
              value={form.ubicacion || ""}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-3"
            />

            <label className="block mb-2 font-medium">Teléfono</label>
            <input
              type="text"
              value={form.telefono || ""}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-3"
            />

            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-3"
            />

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  setForm({});
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !form.nombre ||
                  !form.ubicacion ||
                  !form.telefono ||
                  !form.email
                }
                className={`px-4 py-2 rounded text-white ${
                  !form.nombre ||
                  !form.ubicacion ||
                  !form.telefono ||
                  !form.email
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {editingId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}



import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
