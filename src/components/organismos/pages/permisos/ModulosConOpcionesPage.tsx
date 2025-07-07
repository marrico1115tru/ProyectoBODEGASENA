import { useEffect, useState } from "react";
import { Checkbox } from "@heroui/react";
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

  const handleCheckboxChange = (id: number, campo: CampoPermiso, checked: boolean) => {
    setPermisos((prev) =>
      prev.map((permiso) =>
        permiso.id === id ? { ...permiso, [campo]: checked } : permiso
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
    <div className="p-6 border border-gray-300 rounded-lg bg-gradient-to-br from-gray-100 via-gray-50 to-slate-200 shadow-lg space-y-4">
      <div>
        <label className="block text-sm mb-1 font-semibold text-slate-700">Opción:</label>
        <select
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 bg-slate-50"
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
      <div className="flex gap-4 flex-wrap">
        {(["puedeVer", "puedeCrear", "puedeEditar", "puedeEliminar"] as CampoPermiso[]).map(
          (campo) => (
            <label key={campo} className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Checkbox
                checked={nuevoPermiso[campo]}
                onChange={(event) =>
                  setNuevoPermiso({ ...nuevoPermiso, [campo]: event.target.checked })
                }
                color="primary"
                className="h-5 w-5"
              />
              {campo.replace("puede", "")}
            </label>
          )
        )}
      </div>
      <button
        onClick={crearPermiso}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
      >
        Guardar Permiso
      </button>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-8 space-y-8 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 min-h-screen">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
          Gestión de Permisos por Rol
        </h1>

        <div className="max-w-xs space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Selecciona un rol:
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-slate-50"
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
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow"
            >
              {mostrarFormularioNuevo ? "Cancelar" : "Crear nuevo permiso"}
            </button>

            {mostrarFormularioNuevo && renderFormularioNuevo()}
          </div>
        )}

        {rolSeleccionado && (
          <div className="overflow-auto rounded-xl border border-gray-200 shadow-lg bg-gradient-to-br from-slate-50 via-slate-100 to-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 w-1/2">
                    Opción
                  </th>
                  <th className="px-4 py-3 text-center text-slate-700">Ver</th>
                  <th className="px-4 py-3 text-center text-slate-700">Crear</th>
                  <th className="px-4 py-3 text-center text-slate-700">Editar</th>
                  <th className="px-4 py-3 text-center text-slate-700">Eliminar</th>
                  <th className="px-4 py-3 text-center text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white/80">
                {permisos.map((permiso) => (
                  <tr key={permiso.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {permiso.opcion.nombreOpcion}
                      <div className="text-xs text-slate-500">
                        {permiso.opcion.rutaFrontend}
                      </div>
                    </td>
                    {(["puedeVer", "puedeCrear", "puedeEditar", "puedeEliminar"] as CampoPermiso[]).map(
                      (campo) => (
                        <td key={campo} className="px-4 py-3 text-center">
                          <Checkbox
                            checked={permiso[campo]}
                            onChange={(event) =>
                              handleCheckboxChange(permiso.id, campo, event.target.checked)
                            }
                            color="primary"
                            className="h-5 w-5"
                          />
                        </td>
                      )
                    )}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => eliminarPermiso(permiso.id)}
                        className="text-red-600 hover:text-red-800 hover:underline text-sm transition font-semibold"
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
              className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-lg font-bold transition disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "Guardar Permisos"}
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
