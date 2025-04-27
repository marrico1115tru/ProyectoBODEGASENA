import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DefaultLayout from "@/layouts/default";
import Swal from "sweetalert2";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/Api/Usuariosform";

interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  cedula: string;
  email: string;
  telefono: string;
  cargo: string;
  id_area: number;
  id_ficha: number;
}

const UsuariosView = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsers();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteUser(id);
        await cargarUsuarios();
        Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
      }
    }
  };

  const handleEdit = async (usuario: Usuario) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Usuario",
      html:
        `<input id="nombre" class="swal2-input" placeholder="Nombre" value="${usuario.nombre}">` +
        `<input id="apellidos" class="swal2-input" placeholder="Apellidos" value="${usuario.apellidos}">` +
        `<input id="cedula" class="swal2-input" placeholder="Cédula" value="${usuario.cedula}">` +
        `<input id="email" class="swal2-input" placeholder="Email" value="${usuario.email}">` +
        `<input id="telefono" class="swal2-input" placeholder="Teléfono" value="${usuario.telefono}">` +
        `<input id="cargo" class="swal2-input" placeholder="Cargo" value="${usuario.cargo}">` +
        `<input id="id_area" class="swal2-input" placeholder="ID Área" value="${usuario.id_area}">` +
        `<input id="id_ficha" class="swal2-input" placeholder="ID Ficha" value="${usuario.id_ficha}">`,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const apellidos = (document.getElementById("apellidos") as HTMLInputElement).value;
        const cedula = (document.getElementById("cedula") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const telefono = (document.getElementById("telefono") as HTMLInputElement).value;
        const cargo = (document.getElementById("cargo") as HTMLInputElement).value;
        const id_area = Number((document.getElementById("id_area") as HTMLInputElement).value);
        const id_ficha = Number((document.getElementById("id_ficha") as HTMLInputElement).value);

        if (!nombre || !apellidos || !cedula || !email) {
          Swal.showValidationMessage("Por favor completa los campos obligatorios.");
          return;
        }

        return { nombre, apellidos, cedula, email, telefono, cargo, id_area, id_ficha };
      },
    });

    if (formValues) {
      try {
        await updateUser(usuario.id, formValues);
        await cargarUsuarios();
        Swal.fire("Actualizado", "El usuario ha sido actualizado.", "success");
      } catch (error) {
        console.error("Error actualizando usuario:", error);
        Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
      }
    }
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Usuario",
      html:
        `<input id="nombre" class="swal2-input" placeholder="Nombre">` +
        `<input id="apellidos" class="swal2-input" placeholder="Apellidos">` +
        `<input id="cedula" class="swal2-input" placeholder="Cédula">` +
        `<input id="email" class="swal2-input" placeholder="Email">` +
        `<input id="telefono" class="swal2-input" placeholder="Teléfono">` +
        `<input id="cargo" class="swal2-input" placeholder="Cargo">` +
        `<input id="id_area" class="swal2-input" placeholder="ID Área">` +
        `<input id="id_ficha" class="swal2-input" placeholder="ID Ficha">`,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const apellidos = (document.getElementById("apellidos") as HTMLInputElement).value;
        const cedula = (document.getElementById("cedula") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const telefono = (document.getElementById("telefono") as HTMLInputElement).value;
        const cargo = (document.getElementById("cargo") as HTMLInputElement).value;
        const id_area = Number((document.getElementById("id_area") as HTMLInputElement).value);
        const id_ficha = Number((document.getElementById("id_ficha") as HTMLInputElement).value);

        if (!nombre || !apellidos || !cedula || !email) {
          Swal.showValidationMessage("Por favor completa los campos obligatorios.");
          return;
        }

        return { nombre, apellidos, cedula, email, telefono, cargo, id_area, id_ficha };
      },
    });

    if (formValues) {
      try {
        await createUser(formValues);
        await cargarUsuarios();
        Swal.fire("Creado", "Usuario creado exitosamente.", "success");
      } catch (error) {
        console.error("Error creando usuario:", error);
        Swal.fire("Error", "No se pudo crear el usuario.", "error");
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8">
        <Card className="mb-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
            <Button
              onClick={handleCreate}
              className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              Crear Usuario
            </Button>
          </div>
        </Card>

        <Card className="max-w-6xl mx-auto">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Apellidos</th>
                  <th className="px-4 py-2">Cédula</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Teléfono</th>
                  <th className="px-4 py-2">Cargo</th>
                  <th className="px-2 py-2">Área</th>
                  <th className="px-2 py-2">Ficha</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="bg-white border-b hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-4 py-2">{usuario.nombre}</td>
                    <td className="px-4 py-2">{usuario.apellidos}</td>
                    <td className="px-4 py-2">{usuario.cedula}</td>
                    <td className="px-4 py-2">{usuario.email}</td>
                    <td className="px-4 py-2">{usuario.telefono}</td>
                    <td className="px-4 py-2 capitalize">{usuario.cargo}</td>
                    <td className="px-2 py-2">{usuario.id_area}</td>
                    <td className="px-2 py-2">{usuario.id_ficha}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => handleEdit(usuario)}
                      >
                        Editar
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white text-xs"
                        onClick={() => handleDelete(usuario.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default UsuariosView;
