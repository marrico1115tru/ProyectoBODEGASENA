// PermisosPage.tsx
import { useEffect, useState } from 'react';
import { obtenerPermisosPorRol, actualizarPermiso } from '@/Api/permisosRoles';
import { getRoles } from '@/Api/RolService';
import DefaultLayout from '@/layouts/default';

interface Rol {
  id: number;
  nombre: string | null;
}

interface Opcion {
  id: number;
  nombreOpcion: string;
}

interface Permiso {
  id: number;
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  opcion: Opcion;
}

export default function PermisosPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
  const [permisos, setPermisos] = useState<Permiso[]>([]);

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(err => console.error('Error cargando roles', err));
  }, []);

  useEffect(() => {
    if (rolSeleccionado) {
      obtenerPermisosPorRol(rolSeleccionado)
        .then(data => setPermisos(data))
        .catch(err => console.error('Error obteniendo permisos', err));
    } else {
      setPermisos([]);
    }
  }, [rolSeleccionado]);

  const handleChange = async (
    idPermiso: number,
    campo: keyof Omit<Permiso, 'id' | 'opcion'>,
    valor: boolean
  ) => {
    const actualizado = permisos.map(p =>
      p.id === idPermiso ? { ...p, [campo]: valor } : p
    );
    setPermisos(actualizado);
    await actualizarPermiso(idPermiso, { [campo]: valor });
  };

  return (
    <DefaultLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Gestión de Permisos por Rol</h1>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Selecciona un rol:</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 text-black"
            value={rolSeleccionado || ''}
            onChange={e => setRolSeleccionado(Number(e.target.value))}
          >
            <option value="">Selecciona un rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre?.trim() || `Rol ID: ${rol.id}`}
              </option>
            ))}
          </select>
        </div>

        {rolSeleccionado && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left">Opción</th>
                  <th className="px-4 py-2 text-center">Ver</th>
                  <th className="px-4 py-2 text-center">Crear</th>
                  <th className="px-4 py-2 text-center">Editar</th>
                  <th className="px-4 py-2 text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {permisos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">Este rol no tiene permisos asignados.</td>
                  </tr>
                ) : (
                  permisos.map(permiso => (
                    <tr key={permiso.id} className="border-t">
                      <td className="px-4 py-2">{permiso.opcion.nombreOpcion}</td>
                      {['puedeVer', 'puedeCrear', 'puedeEditar', 'puedeEliminar'].map((campo) => (
                        <td key={campo} className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={permiso[campo as keyof Permiso] as boolean}
                            onChange={e => handleChange(
                              permiso.id,
                              campo as keyof Omit<Permiso, 'id' | 'opcion'>,
                              e.target.checked
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
