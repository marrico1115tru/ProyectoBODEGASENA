import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import axios from "@/Api/axios";

interface Rol {
  id: number;
  nombreRol: string;
}

interface Permiso {
  id: number;
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  opcion: {
    id: number;
    nombreOpcion: string;
    rutaFrontend: string;
  };
}

export default function GestionPermisosPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [guardando, setGuardando] = useState(false);

  // Obtener roles al cargar la página
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("/roles");
        setRoles(res.data);
      } catch (err) {
        console.error("Error al obtener roles", err);
      }
    };
    fetchRoles();
  }, []);

  // Obtener permisos cuando cambia el rol seleccionado
  useEffect(() => {
    if (rolSeleccionado) {
      axios
        .get(`/permisos/rol/${rolSeleccionado}`)
        .then((res) => setPermisos(res.data.data))
        .catch((err) => {
          console.error("Error al obtener permisos", err);
        });
    }
  }, [rolSeleccionado]);

  // Manejar cambio de estado en los checkboxes
  const handleCheckboxChange = (
    id: number,
    campo: keyof Omit<Permiso, "id" | "opcion">,
    value: boolean
  ) => {
    setPermisos((prev) =>
      prev.map((permiso) =>
        permiso.id === id ? { ...permiso, [campo]: value } : permiso
      )
    );
  };

  // Guardar permisos (PUT al backend)
  const guardarPermisos = async () => {
    try {
      setGuardando(true);

      // ✅ Limpiar datos antes de enviar (solo campos esperados por el DTO)
      const permisosAEnviar = permisos.map((p) => ({
        id: p.id,
        puedeVer: p.puedeVer,
        puedeCrear: p.puedeCrear,
        puedeEditar: p.puedeEditar,
        puedeEliminar: p.puedeEliminar,
      }));

      await axios.put("/permisos/actualizar-masivo", {
        permisos: permisosAEnviar,
      });

      alert("✅ Permisos actualizados correctamente");
    } catch (err) {
      console.error("Error al guardar permisos", err);
      alert("❌ Error al guardar permisos");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Permisos por Rol</h1>

        {/* Selector de roles */}
        <div className="max-w-sm space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona un rol:
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            onChange={(e) => setRolSeleccionado(Number(e.target.value))}
            defaultValue=""
          >
            <option value="" disabled>
              -- Selecciona --
            </option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombreRol}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla de permisos */}
        {rolSeleccionado && (
          <div className="overflow-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 w-1/2">Opción</th>
                  <th className="px-4 py-3 text-center">Ver</th>
                  <th className="px-4 py-3 text-center">Crear</th>
                  <th className="px-4 py-3 text-center">Editar</th>
                  <th className="px-4 py-3 text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {permisos.map((permiso) => (
                  <tr key={permiso.id}>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {permiso.opcion.nombreOpcion}
                      <div className="text-xs text-gray-500">
                        {permiso.opcion.rutaFrontend}
                      </div>
                    </td>
                    {["puedeVer", "puedeCrear", "puedeEditar", "puedeEliminar"].map((campo) => (
                      <td key={campo} className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(permiso[campo as keyof Permiso])}
                          onChange={(e) =>
                            handleCheckboxChange(
                              permiso.id,
                              campo as "puedeVer" | "puedeCrear" | "puedeEditar" | "puedeEliminar",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Botón de guardar */}
        {rolSeleccionado && (
          <div className="flex justify-end pt-4">
            <button
              onClick={guardarPermisos}
              disabled={guardando}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
            >
              {guardando ? "Guardando..." : "Guardar Permisos"}
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
