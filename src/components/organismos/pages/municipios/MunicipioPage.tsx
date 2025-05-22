import { useEffect, useState } from "react";
import {
  getMunicipios,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
} from "@/Api/MunicipiosForm";
import { Municipio } from "@/types/types/typesMunicipio";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

const ALL_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "nombre", label: "Nombre" },
  { id: "departamento", label: "Departamento" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "acciones", label: "Acciones" },
];

export default function MunicipioPage() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>([]);
  const [form, setForm] = useState<Partial<Municipio>>({});
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
    const data = await getMunicipios();
    setMunicipios(data);
  };

  useEffect(() => {
    const filtered = municipios.filter((m) =>
      `${m.nombre} ${m.departamento}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredMunicipios(filtered);
    setCurrentPage(1);
  }, [searchTerm, municipios]);

  const handleSubmit = async () => {
    if (editingId) {
      await updateMunicipio(editingId, form);
    } else {
      await createMunicipio({
        ...form,
        fechaCreacion: new Date().toISOString(),
      });
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

  const toggleColumn = (id: string) => {
    setVisibleColumns((cols) =>
      cols.includes(id) ? cols.filter((c) => c !== id) : [...cols, id]
    );
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filteredMunicipios.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredMunicipios.length / rowsPerPage);

  return (
    <DefaultLayout>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          🌍 Gestión de Municipios
        </h1>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o departamento..."
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
        Total municipios: {filteredMunicipios.length}
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
              paginated.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  {visibleColumns.includes("id") && (
                    <td className="px-6 py-3">{m.id}</td>
                  )}
                  {visibleColumns.includes("nombre") && (
                    <td className="px-6 py-3">{m.nombre}</td>
                  )}
                  {visibleColumns.includes("departamento") && (
                    <td className="px-6 py-3">{m.departamento}</td>
                  )}
                  {visibleColumns.includes("fechaCreacion") && (
                    <td className="px-6 py-3">
                      {new Date(m.fechaCreacion).toLocaleDateString()}
                    </td>
                  )}
                  {visibleColumns.includes("acciones") && (
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
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
                  No se encontraron municipios.
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
    </DefaultLayout>
  );
}
