import { useEffect, useState } from "react";
import {
  getSedes,
  createSede,
  updateSede,
  deleteSede,
} from "@/Api/SedesService";
import { getCentrosFormacion } from "@/Api/centrosformacionTable";
import { Sede } from "@/types/types/Sede";
import { CentroFormacion } from "@/types/types/typesCentroFormacion";
import DefaultLayout from "@/layouts/default";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";

/* --------- Columnas visibles (sin fechaFinalización) --------- */
const ALL_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "nombre", label: "Nombre" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "centroFormacion", label: "Centro de Formación" },
  { id: "fechaCreacion", label: "Fecha de Creación" },
  { id: "acciones", label: "Acciones" },
] as const;

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [filteredSedes, setFilteredSedes] = useState<Sede[]>([]);
  const [form, setForm] = useState<Partial<Sede>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.id)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  /* ---------------- Carga inicial ---------------- */
  useEffect(() => {
    Promise.all([getSedes(), getCentrosFormacion()]).then(
      ([sedesData, centrosData]) => {
        setSedes(Array.isArray(sedesData) ? sedesData : []);
        setCentros(Array.isArray(centrosData) ? centrosData : []);
      }
    );
  }, []);

  /* -------------- Filtro de búsqueda -------------- */
  useEffect(() => {
    const filtered = sedes.filter((s) =>
      `${s.nombre ?? ""} ${s.ubicacion ?? ""} ${s.centroFormacion?.nombre ?? ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredSedes(filtered);
    setCurrentPage(1);
  }, [searchTerm, sedes]);

  /* ----------- Crear / actualizar sede ----------- */
  const handleSubmit = async () => {
    if (!form.nombre || !form.ubicacion || !form.idCentroFormacion) {
      return alert("Todos los campos son obligatorios.");
    }
    try {
      if (editingId) {
        await updateSede(editingId, form);
      } else {
        await createSede({ ...form, fechaCreacion: new Date().toISOString() });
      }
      setOpen(false);
      setForm({});
      setEditingId(null);
      setSedes(await getSedes());
    } catch (err) {
      console.error("Error al guardar la sede:", err);
    }
  };

  /* ---------------- Editar sede ----------------- */
  const handleEdit = (sede: Sede) => {
    setForm({
      id: sede.id,
      nombre: sede.nombre,
      ubicacion: sede.ubicacion,
      idCentroFormacion: sede.centroFormacion?.id,
    });
    setEditingId(sede.id);
    setOpen(true);
  };

  /* --------------- Eliminar sede ---------------- */
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta sede?")) {
      await deleteSede(id);
      setSedes(await getSedes());
    }
  };

  /* ------------ Mostrar / ocultar columnas ----------- */
  const toggleColumn = (id: string) => {
    setVisibleColumns((cols) =>
      cols.includes(id) ? cols.filter((c) => c !== id) : [...cols, id]
    );
  };

  /* ---------------- Paginación ---------------- */
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filteredSedes.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredSedes.length / rowsPerPage);

  /* ------------------- Render ------------------ */
  return (
    <DefaultLayout>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🏢 Gestión de Sedes</h1>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre, ubicación o centro..."
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

      {/* Botones de columnas */}
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

      {/* Resumen */}
      <div className="text-sm text-gray-600 mb-2">
        Total sedes: {filteredSedes.length}
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
                      className="px-6 py-3 text-left font-semibold whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length > 0 ? (
              paginated.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  {visibleColumns.includes("id") && (
                    <td className="px-6 py-3 whitespace-nowrap">{s.id}</td>
                  )}
                  {visibleColumns.includes("nombre") && (
                    <td className="px-6 py-3 whitespace-nowrap">{s.nombre}</td>
                  )}
                  {visibleColumns.includes("ubicacion") && (
                    <td className="px-6 py-3 whitespace-nowrap">
                      {s.ubicacion}
                    </td>
                  )}
                  {visibleColumns.includes("centroFormacion") && (
                    <td className="px-6 py-3 whitespace-nowrap">
                      {s.centroFormacion?.nombre ?? "—"}
                    </td>
                  )}
                  {visibleColumns.includes("fechaCreacion") && (
                    <td className="px-6 py-3 whitespace-nowrap">
                      {new Date(s.fechaCreacion).toLocaleDateString()}
                    </td>
                  )}
                  {visibleColumns.includes("acciones") && (
                    <td className="px-6 py-3 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id!)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Eliminar"
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
                  No se encontraron sedes.
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

      {/* Modal creación / edición */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-bold">
              {editingId ? "Editar Sede" : "Crear Sede"}
            </Dialog.Title>

            <input
              type="text"
              placeholder="Nombre de la sede"
              value={form.nombre ?? ""}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Ubicación"
              value={form.ubicacion ?? ""}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="w-full border p-2 rounded"
            />

            {/* Select centros de formación */}
            <select
              value={form.idCentroFormacion ?? ""}
              onChange={(e) =>
                setForm({ ...form, idCentroFormacion: Number(e.target.value) })
              }
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>
                Seleccione un Centro de Formación
              </option>
              {centros.map((centro) => (
                <option key={centro.id} value={centro.id}>
                  {centro.nombre}
                </option>
              ))}
            </select>

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
