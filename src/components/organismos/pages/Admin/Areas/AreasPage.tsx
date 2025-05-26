import { useEffect, useState } from "react";
import {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
} from "@/Api/AreasService";
import { Area } from "@/types/types/typesArea";
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
  { id: "nombreArea", label: "Nombre Área" },
  { id: "fechaCreacion", label: "Fecha Creación" },
  { id: "fkSitio", label: "ID Sitio" },
  { id: "idCentroFormacion", label: "ID Centro Formación" },
  { id: "acciones", label: "Acciones" },
];

export default function AreaPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState<Partial<Area>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.id)
  );
  const [currentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAreas();
    setAreas(data);
  };

  const filteredAreas = areas.filter((a) =>
    a.nombreArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.nombreArea || !form.fkSitio?.id || !form.idCentroFormacion?.id) {
      return alert("Todos los campos son requeridos");
    }

    if (editingId) {
      await updateArea(editingId, form);
    } else {
      await createArea({
        ...form,
        fechaCreacion: new Date().toISOString(),
        fechaFinalizacion: null,
      } as Area);
    }

    setForm({});
    setEditingId(null);
    setOpen(false);
    fetchData();
  };

  const handleEdit = (area: Area) => {
    setForm(area);
    setEditingId(area.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta área?")) {
      await deleteArea(id);
      fetchData();
    }
  };

  const toggleColumn = (id: string) => {
    setVisibleColumns((cols) =>
      cols.includes(id) ? cols.filter((c) => c !== id) : [...cols, id]
    );
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filteredAreas.slice(startIndex, startIndex + rowsPerPage);

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📋 Gestión de Áreas</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre de área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={() => {
              setForm({});
              setEditingId(null);
              setOpen(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Crear
          </button>
        </div>
      </div>

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

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
          <thead className="bg-blue-100">
            <tr>
              {ALL_COLUMNS.map(
                (col) =>
                  visibleColumns.includes(col.id) && (
                    <th key={col.id} className="px-4 py-2 text-left">
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  {visibleColumns.includes("id") && <td className="px-4 py-2">{a.id}</td>}
                  {visibleColumns.includes("nombreArea") && <td className="px-4 py-2">{a.nombreArea}</td>}
                  {visibleColumns.includes("fechaCreacion") && (
                    <td className="px-4 py-2">{new Date(a.fechaCreacion).toLocaleDateString()}</td>
                  )}
                  {visibleColumns.includes("fkSitio") && <td className="px-4 py-2">{a.fkSitio.id}</td>}
                  {visibleColumns.includes("idCentroFormacion") && (
                    <td className="px-4 py-2">{a.idCentroFormacion.id}</td>
                  )}
                  {visibleColumns.includes("acciones") && (
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(a)} className="text-blue-600">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-600">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={ALL_COLUMNS.length} className="text-center py-4 text-gray-500">
                  No se encontraron áreas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear / Editar */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow space-y-4">
            <Dialog.Title className="text-lg font-bold">
              {editingId ? "Editar Área" : "Crear Área"}
            </Dialog.Title>
            <input
              type="text"
              placeholder="Nombre del área"
              value={form.nombreArea || ""}
              onChange={(e) => setForm({ ...form, nombreArea: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              placeholder="ID Sitio"
              value={form.fkSitio?.id || ""}
              onChange={(e) => setForm({ ...form, fkSitio: { id: parseInt(e.target.value) } })}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              placeholder="ID Centro Formación"
              value={form.idCentroFormacion?.id || ""}
              onChange={(e) =>
                setForm({ ...form, idCentroFormacion: { id: parseInt(e.target.value) } })
              }
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2 pt-4">
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
