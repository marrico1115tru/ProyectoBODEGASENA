// pages/detalles/DetalleSolicitudPage.tsx
import { useEffect, useState } from "react";
import {
  getDetalleSolicitudes,
  createDetalleSolicitud,
  updateDetalleSolicitud,
  deleteDetalleSolicitud,
} from "@/Api/detalles_solicitud";
import { getSolicitudes } from "@/Api/Solicitudes"; // para el select
import { getProductos } from "@/Api/Productosform"; // Asume que existe
import { DetalleSolicitud } from "@/types/types/detalles_solicitud";
import { Solicitud } from "@/types/types/Solicitud";
import { Producto } from "@/types/types/typesProductos";
import DefaultLayout from "@/layouts/default";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

// 😊 Validaciones
const schema = z.object({
  cantidadSolicitada: z
    .string()
    .min(1, "La cantidad es obligatoria")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Debe ser un número mayor que cero",
    }),
  idProducto: z.string().min(1, "Seleccione un Producto"),
  idSolicitud: z.string().min(1, "Seleccione una Solicitud"),
  observaciones: z.string().optional(),
});

export default function DetalleSolicitudPage() {
  const [detalles, setDetalles] = useState<DetalleSolicitud[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [solicitudesList, setSolicitudesList] = useState<Solicitud[]>([]);
  const [formData, setFormData] = useState<Partial<DetalleSolicitud>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDetalles();
    fetchProductos();
    fetchSolicitudes();
  }, []);

  const fetchDetalles = async () => {
    const data = await getDetalleSolicitudes();
    setDetalles(data);
  };

  const fetchProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const fetchSolicitudes = async () => {
    const data = await getSolicitudes();
    setSolicitudesList(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => { errors[err.path[0]] = err.message });
      setFormErrors(errors);
      toast.error("Corrige los campos marcados");
      return;
    }

    const payload = {
      cantidadSolicitada: Number(formData.cantidadSolicitada),
      observaciones: formData.observaciones ?? null,
      idProducto: { id: Number(formData.idProducto) },
      idSolicitud: { id: Number(formData.idSolicitud) },
    };

    try {
      if (editId) {
        await updateDetalleSolicitud(editId, payload);
        toast.success("Detalle actualizado");
      } else {
        await createDetalleSolicitud(payload);
        toast.success("Detalle creado");
      }
      resetForm();
      fetchDetalles();
    } catch {
      toast.error("Error al guardar el detalle");
    }
  };

  const handleEdit = (d: DetalleSolicitud) => {
    setFormErrors({});
    setFormData({
      cantidadSolicitada: String(d.cantidadSolicitada),
      observaciones: d.observaciones ?? "",
      idProducto: String(d.idProducto.id),
      idSolicitud: String(d.idSolicitud.id),
    });
    setEditId(d.id!);
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (id && confirm("¿Eliminar este detalle?")) {
      await deleteDetalleSolicitud(id);
      toast.success("Eliminado");
      fetchDetalles();
    }
  };

  const resetForm = () => {
    setFormData({});
    setFormErrors({});
    setEditId(null);
    setShowForm(false);
  };

  // tabla y paginación...
  const filtered = detalles.filter(d => d.idProducto.nombre.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📋 Detalles de Solicitud</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700">
            <PlusIcon className="w-5 h-5 mr-2"/> Crear Detalle
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
          className="mb-4 w-full max-w-md border px-4 py-2 rounded shadow-sm"
        />

        {/* Tabla */}
        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100 text-gray-700"><tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Cantidad</th>
              <th className="px-6 py-3">Observ.</th>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Solicitud</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">No hay registros</td></tr>
              ) : paginated.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-2">{d.id}</td>
                  <td className="px-6 py-2">{d.cantidadSolicitada}</td>
                  <td className="px-6 py-2">{d.observaciones || "—"}</td>
                  <td className="px-6 py-2">{d.idProducto.nombre}</td>
                  <td className="px-6 py-2">{d.idSolicitud.id}</td>
                  <td className="px-6 py-2 flex justify-center gap-2">
                    <button onClick={() => handleEdit(d)} className="text-yellow-600 hover:text-yellow-800"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Anterior</button>
            <span className="px-2 text-sm">{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Siguiente</button>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editId ? "Editar Detalle" : "Crear Detalle"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Cantidad</label>
                <input
                  type="number"
                  name="cantidadSolicitada"
                  value={formData.cantidadSolicitada || ""}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded ${formErrors["cantidadSolicitada"] ? "border-red-500" : ""}`}
                />
                {formErrors["cantidadSolicitada"] && <p className="text-red-500 text-sm">{formErrors["cantidadSolicitada"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Producto</label>
                <select
                  name="idProducto"
                  value={formData.idProducto as unknown as string || ""}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded ${formErrors["idProducto"] ? "border-red-500" : ""}`}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
                {formErrors["idProducto"] && <p className="text-red-500 text-sm">{formErrors["idProducto"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Solicitud</label>
                <select
                  name="idSolicitud"
                  value={formData.idSolicitud as unknown as string || ""}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded ${formErrors["idSolicitud"] ? "border-red-500" : ""}`}
                >
                  <option value="">Seleccione una solicitud</option>
                  {solicitudesList.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                </select>
                {formErrors["idSolicitud"] && <p className="text-red-500 text-sm">{formErrors["idSolicitud"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded">
                  {editId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
