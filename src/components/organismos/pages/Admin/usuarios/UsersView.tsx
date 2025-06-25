// ✅ /pages/usuarios/UsuariosPage.tsx (actualizado con estilo tipo InventarioPage)
import { useEffect, useState } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "@/Api/Usuariosform";
import { getAreas } from "@/Api/AreasService";
import { getFichasFormacion } from "@/Api/fichasFormacion";
import { getRoles } from "@/Api/RolService";
import { Usuario } from "@/types/types/Usuario";
import { Area } from "@/types/types/typesArea";
import { FichaFormacion } from "@/types/types/FichaFormacion";
import { Rol } from "@/types/types/Rol";
import DefaultLayout from "@/layouts/default";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";

const usuarioSchema = z.object({
  nombre: z.string().min(1, "Campo requerido"),
  apellido: z.string().nullable().optional(),
  cedula: z.string().nullable().optional(),
  email: z.string().email("Correo inválido").nullable().optional(),
  telefono: z.string().nullable().optional(),
  password: z.string().min(4, "Mínimo 4 caracteres"),
  idArea: z.coerce.number().min(1, "Seleccione un área"),
  idFichaFormacion: z.coerce.number().min(1, "Seleccione una ficha"),
  idRol: z.coerce.number().min(1, "Seleccione un rol"),
});

type UsuarioSchema = z.infer<typeof usuarioSchema>;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [fichas, setFichas] = useState<FichaFormacion[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UsuarioSchema>({
    resolver: zodResolver(usuarioSchema),
  });

  useEffect(() => {
    fetchUsuarios();
    getAreas().then(setAreas);
    getFichasFormacion().then(setFichas);
    getRoles().then(setRoles);
  }, []);

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const onSubmit = async (data: UsuarioSchema) => {
    try {
      if (editingId) {
        await updateUsuario(editingId, data);
        toast.success("Usuario actualizado");
      } else {
        await createUsuario(data);
        toast.success("Usuario creado");
      }
      fetchUsuarios();
      setIsModalOpen(false);
      reset();
    } catch (err) {
      toast.error("Error guardando usuario");
    }
  };

  const handleEdit = (u: Usuario) => {
    setValue("nombre", u.nombre);
    setValue("apellido", u.apellido ?? "");
    setValue("cedula", u.cedula ?? "");
    setValue("email", u.email ?? "");
    setValue("telefono", u.telefono ?? "");
    setValue("password", u.password);
    setValue("idArea", u.idArea?.id ?? 0);
    setValue("idFichaFormacion", u.idFichaFormacion?.id ?? 0);
    setValue("idRol", u.idRol?.id ?? 0);
    setEditingId(u.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este usuario?")) {
      try {
        await deleteUsuario(id);
        fetchUsuarios();
      } catch {
        toast.error("No se puede eliminar este usuario. Tiene datos relacionados.");
      }
    }
  };

  return (
    <DefaultLayout>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">👤 Usuarios</h1>
          <button
            onClick={() => {
              reset();
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" /> Crear
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Área</th>
                <th className="px-4 py-2">Ficha</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{u.nombre}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.idArea?.nombreArea ?? '-'}</td>
                    <td className="px-4 py-2">{u.idFichaFormacion?.nombre ?? '-'}</td>
                    <td className="px-4 py-2">{u.idRol?.nombreRol ?? '-'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-600 hover:underline"
                      >Editar</button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:underline"
                      >Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Editar Usuario" : "Crear Usuario"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-red-500"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Nombre</label>
                <input {...register("nombre")} className="w-full border px-3 py-2 rounded" />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Correo</label>
                <input {...register("email")} className="w-full border px-3 py-2 rounded" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Teléfono</label>
                <input {...register("telefono")} className="w-full border px-3 py-2 rounded" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Contraseña</label>
                <input {...register("password")} className="w-full border px-3 py-2 rounded" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Área</label>
                <select {...register("idArea")} className="w-full border px-3 py-2 rounded">
                  <option value={0}>Seleccione un área</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombreArea}</option>
                  ))}
                </select>
                {errors.idArea && <p className="text-red-500 text-sm">{errors.idArea.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Ficha</label>
                <select {...register("idFichaFormacion")} className="w-full border px-3 py-2 rounded">
                  <option value={0}>Seleccione una ficha</option>
                  {fichas.map((f) => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                  ))}
                </select>
                {errors.idFichaFormacion && <p className="text-red-500 text-sm">{errors.idFichaFormacion.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Rol</label>
                <select {...register("idRol")} className="w-full border px-3 py-2 rounded">
                  <option value={0}>Seleccione un rol</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombreRol}</option>
                  ))}
                </select>
                {errors.idRol && <p className="text-red-500 text-sm">{errors.idRol.message}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >Cancelar</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                >{editingId ? "Actualizar" : "Crear"}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
