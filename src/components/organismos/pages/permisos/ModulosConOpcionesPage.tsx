import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import axios from "@/Api/axios";

interface Rol {
  id: number;
  nombreRol: string;
}

interface Opcion {
  id: number;
  nombreOpcion: string;
  rutaFrontend: string;
}

interface Permiso {
  id: number;
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  opcion: Opcion;
}

type CampoPermiso = "puedeVer" | "puedeCrear" | "puedeEditar" | "puedeEliminar";

export default function GestionPermisosPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [opciones, setOpciones] = useState<Opcion[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);

  const [nuevoPermiso, setNuevoPermiso] = useState({
    id_opcion: "",
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRoles, resOpciones] = await Promise.all([
          axios.get("/roles"),
          axios.get("/opciones"),
        ]);
        setRoles(resRoles.data);
        setOpciones(resOpciones.data);
      } catch (err) {
        console.error("Error al cargar roles u opciones", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (rolSeleccionado) {
      cargarPermisos();
    }
  }, [rolSeleccionado]);

  const cargarPermisos = async () => {
    try {
      const res = await axios.get(`/permisos/rol/${rolSeleccionado}`);
      setPermisos(res.data.data);
    } catch (err) {
      console.error("Error al obtener permisos", err);
    }
  };

  const handleCheckboxChange = (id: number, campo: CampoPermiso, value: boolean) => {
    setPermisos((prev) =>
      prev.map((permiso) =>
        permiso.id === id ? { ...permiso, [campo]: value } : permiso
      )
    );
  };

  const guardarPermisos = async () => {
    try {
      setGuardando(true);
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
    } catch (err: any) {
      console.error("Error al guardar permisos", err);
      alert("❌ Error al guardar permisos");
    } finally {
      setGuardando(false);
    }
  };

  const crearPermiso = async () => {
    try {
      if (!rolSeleccionado || !nuevoPermiso.id_opcion) {
        alert("❗ Debes seleccionar un rol y una opción");
        return;
      }

      await axios.post("/permisos", {
        id_rol: rolSeleccionado,
        id_opcion: Number(nuevoPermiso.id_opcion),
        puedeVer: nuevoPermiso.puedeVer,
        puedeCrear: nuevoPermiso.puedeCrear,
        puedeEditar: nuevoPermiso.puedeEditar,
        puedeEliminar: nuevoPermiso.puedeEliminar,
      });

      alert("✅ Permiso creado correctamente");
      setMostrarFormularioNuevo(false);
      setNuevoPermiso({
        id_opcion: "",
        puedeVer: false,
        puedeCrear: false,
        puedeEditar: false,
        puedeEliminar: false,
      });

      cargarPermisos();
    } catch (err: any) {
      console.error("Error al crear permiso", err);
      if (err.response?.data?.message) {
        alert(`❌ ${err.response.data.message}`);
      } else {
        alert("❌ Error al crear permiso");
      }
    }
  };

  const eliminarPermiso = async (id: number) => {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este permiso?");
    if (!confirmar) return;

    try {
      await axios.delete(`/permisos/${id}`);
      alert("✅ Permiso eliminado correctamente");
      cargarPermisos(); // recargar después de eliminar
    } catch (err) {
      console.error("Error al eliminar permiso", err);
      alert("❌ Error al eliminar permiso");
    }
  };

  const renderFormularioNuevo = () => (
    <div className="p-4 border border-gray-300 rounded-md space-y-2">
      <div>
        <label className="block text-sm mb-1 font-medium">Opción:</label>
        <select
          className="w-full border px-2 py-1 rounded"
          name="id_opcion"
          value={nuevoPermiso.id_opcion}
          onChange={(e) =>
            setNuevoPermiso({ ...nuevoPermiso, id_opcion: e.target.value })
          }
        >
          <option value="">-- Selecciona opción --</option>
          {opciones.map((op) => (
            <option key={op.id} value={op.id}>
              {op.nombreOpcion}
            </option>
          ))}
        </select>
      </div>
      {(["puedeVer", "puedeCrear", "puedeEditar", "puedeEliminar"] as CampoPermiso[]).map(
        (campo) => (
          <label key={campo} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nuevoPermiso[campo]}
              onChange={(e) =>
                setNuevoPermiso({ ...nuevoPermiso, [campo]: e.target.checked })
              }
            />
            <span>{campo}</span>
          </label>
        )
      )}
      <button
        onClick={crearPermiso}
        className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700"
      >
        Guardar Permiso
      </button>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Permisos por Rol</h1>

        <div className="max-w-sm space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona un rol:
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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

        {rolSeleccionado && (
          <div className="space-y-4">
            <button
              onClick={() => setMostrarFormularioNuevo(!mostrarFormularioNuevo)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {mostrarFormularioNuevo ? "Cancelar" : "Crear nuevo permiso"}
            </button>

            {mostrarFormularioNuevo && renderFormularioNuevo()}
          </div>
        )}

        {rolSeleccionado && (
          <div className="overflow-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 w-1/2">
                    Opción
                  </th>
                  <th className="px-4 py-3 text-center">Ver</th>
                  <th className="px-4 py-3 text-center">Crear</th>
                  <th className="px-4 py-3 text-center">Editar</th>
                  <th className="px-4 py-3 text-center">Eliminar</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
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
                    {(["puedeVer", "puedeCrear", "puedeEditar", "puedeEliminar"] as CampoPermiso[]).map(
                      (campo) => (
                        <td key={campo} className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={permiso[campo]}
                            onChange={(e) =>
                              handleCheckboxChange(permiso.id, campo, e.target.checked)
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      )
                    )}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => eliminarPermiso(permiso.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
