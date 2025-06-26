import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';
import Swal from 'sweetalert2';
import {
  fetchMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  MovimientoMaterial
} from '@/Api/Movimientosform';
import axios from 'axios';

interface Permisos {
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
}

const MovimientosTable = () => {
  const [movimientos, setMovimientos] = useState<MovimientoMaterial[]>([]);
  const [permisos, setPermisos] = useState<Permisos>({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });
  const [loadingPermisos, setLoadingPermisos] = useState(true);

  useEffect(() => {
    obtenerPermisos();
  }, []);

  useEffect(() => {
    if (permisos.puedeVer) {
      cargarMovimientos();
    }
  }, [permisos]);

  const obtenerPermisos = async () => {
    try {
      const idRol = localStorage.getItem("idRol");
      if (!idRol) {
        setLoadingPermisos(false);
        return;
      }

      const ruta = "/MovimientoInventarioPage";
      const res = await axios.get(
        `http://localhost:3000/permisos/por-ruta?ruta=${ruta}&idRol=${idRol}`
      );

      setPermisos(res.data.data);
    } catch (error) {
      console.error("❌ Error obteniendo permisos:", error);
    } finally {
      setLoadingPermisos(false);
    }
  };

  const cargarMovimientos = async () => {
    try {
      const data = await fetchMovimientos();
      setMovimientos(data);
    } catch (error) {
      console.error("❌ Error cargando movimientos:", error);
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
        await deleteMovimiento(id);
        await cargarMovimientos();
        Swal.fire("¡Eliminado!", "El movimiento ha sido eliminado.", "success");
      } catch (error) {
        console.error("❌ Error eliminando movimiento:", error);
        Swal.fire("Error", "No se pudo eliminar el movimiento.", "error");
      }
    }
  };

  const handleEdit = async (movimiento: MovimientoMaterial) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Movimiento",
      html: `
        <input id="tipo" class="swal2-input" placeholder="Tipo" value="${movimiento.tipo}">
        <input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad" value="${movimiento.cantidad}">
        <input id="fecha" type="date" class="swal2-input" value="${movimiento.fecha?.split('T')[0]}">
        <input id="id_producto" type="number" class="swal2-input" placeholder="ID Producto" value="${movimiento.id_producto}">
        <input id="id_usuario" type="number" class="swal2-input" placeholder="ID Usuario" value="${movimiento.id_usuario}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const get = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
        return {
          tipo: get("tipo"),
          cantidad: Number(get("cantidad")),
          fecha: get("fecha"),
          id_producto: Number(get("id_producto")),
          id_usuario: Number(get("id_usuario")),
        };
      },
    });

    if (formValues) {
      try {
        await updateMovimiento(movimiento.id, formValues);
        await cargarMovimientos();
        Swal.fire("Actualizado", "Movimiento actualizado exitosamente.", "success");
      } catch (error) {
        console.error("❌ Error actualizando movimiento:", error);
        Swal.fire("Error", "No se pudo actualizar el movimiento.", "error");
      }
    }
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Movimiento",
      html: `
        <input id="tipo" class="swal2-input" placeholder="Tipo">
        <input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad">
        <input id="fecha" type="date" class="swal2-input">
        <input id="id_producto" type="number" class="swal2-input" placeholder="ID Producto">
        <input id="id_usuario" type="number" class="swal2-input" placeholder="ID Usuario">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const get = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
        return {
          tipo: get("tipo"),
          cantidad: Number(get("cantidad")),
          fecha: get("fecha"),
          id_producto: Number(get("id_producto")),
          id_usuario: Number(get("id_usuario")),
        };
      },
    });

    if (formValues) {
      try {
        await createMovimiento(formValues);
        await cargarMovimientos();
        Swal.fire("Creado", "Movimiento creado exitosamente.", "success");
      } catch (error) {
        console.error("❌ Error creando movimiento:", error);
        Swal.fire("Error", "No se pudo crear el movimiento.", "error");
      }
    }
  };

  const getTipoTexto = (tipo: any) => {
    if (tipo === 1 || tipo === "1" || tipo.toLowerCase() === "entrada") return "Entrada";
    return "Salida";
  };

  if (loadingPermisos) {
    return (
      <DefaultLayout>
        <div className="text-center py-10 text-gray-500 text-lg">⏳ Cargando permisos...</div>
      </DefaultLayout>
    );
  }

  if (!permisos.puedeVer) {
    return (
      <DefaultLayout>
        <div className="text-center py-10 text-red-600 text-xl font-semibold">
          🔒 No tienes permiso para ver esta página.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-6">
        <Card className="w-full rounded-2xl shadow-md p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Movimientos de Materiales</h1>
            {permisos.puedeCrear && (
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Nuevo Movimiento
              </Button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">ID Producto</th>
                  <th className="px-4 py-3">ID Usuario</th>
                  {(permisos.puedeEditar || permisos.puedeEliminar) && (
                    <th className="px-4 py-3">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {movimientos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-gray-500">
                      No hay movimientos registrados.
                    </td>
                  </tr>
                ) : (
                  movimientos.map((movimiento) => (
                    <tr key={movimiento.id} className="border-b hover:bg-gray-100">
                      <td className="text-center py-2">{getTipoTexto(movimiento.tipo)}</td>
                      <td className="text-center py-2">{movimiento.cantidad}</td>
                      <td className="text-center py-2">{new Date(movimiento.fecha).toLocaleDateString()}</td>
                      <td className="text-center py-2">{movimiento.id_producto}</td>
                      <td className="text-center py-2">{movimiento.id_usuario}</td>
                      {(permisos.puedeEditar || permisos.puedeEliminar) && (
                        <td className="text-center py-2 flex justify-center gap-2">
                          {permisos.puedeEditar && (
                            <Button
                              onClick={() => handleEdit(movimiento)}
                              className="bg-yellow-500 text-white"
                            >
                              Editar
                            </Button>
                          )}
                          {permisos.puedeEliminar && (
                            <Button
                              onClick={() => handleDelete(movimiento.id)}
                              className="bg-red-600 text-white"
                            >
                              Eliminar
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default MovimientosTable;
