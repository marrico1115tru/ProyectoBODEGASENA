import { useEffect, useState } from "react";
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
} from "@/Api/RolService";
import { Rol } from "@/types/types/Rol";
import DefaultLayout from "@/layouts/default";
import { PlusIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

// Esquema Zod
const rolSchema = z.object({
  nombreRol: z
    .string()
    .min(1, "El nombre del rol es obligatorio")
    .max(50, "Máximo 50 caracteres"),
});

type RolFormValues = z.infer<typeof rolSchema>;

export default function RolPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RolFormValues>({
    resolver: zodResolver(rolSchema),
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  const onSubmit = async (data: RolFormValues) => {
    try {
      if (editingId) {
        await updateRol(editingId, data);
        toast.success("Rol actualizado");
      } else {
        await createRol(data);
        toast.success("Rol creado");
      }
      fetchRoles();
      setIsModalOpen(false);
      setEditingId(null);
      reset();
    } catch (err) {
      toast.error("Error al guardar");
    }
  };

  const handleEdit = (rol: Rol) => {
    setEditingId(rol.id);
    setValue("nombreRol", rol.nombreRol);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este rol?")) {
      await deleteRol(id);
      fetchRoles();
      toast.success("Rol eliminado");
    }
  };

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            🎖️ Gestión de Roles
          </h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingId(null);
              reset();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Crear
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre del Rol</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No hay registros.
                  </td>
                </tr>
              ) : (
                roles.map((rol) => (
                  <tr key={rol.id} className="border-t">
                    <td className="px-4 py-2">{rol.id}</td>
                    <td className="px-4 py-2">{rol.nombreRol}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(rol)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(rol.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de formulario */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Editar Rol" : "Crear Rol"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre del rol
                  </label>
                  <input
                    type="text"
                    {...register("nombreRol")}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Ej: Administrador"
                  />
                  {errors.nombreRol && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.nombreRol.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingId ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
