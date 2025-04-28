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

const MovimientosTable = () => {
  const [movimientos, setMovimientos] = useState<MovimientoMaterial[]>([]);

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    try {
      const data = await fetchMovimientos();
      setMovimientos(data);
    } catch (error) {
      console.error("Error cargando movimientos:", error);
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
        console.error("Error eliminando movimiento:", error);
        Swal.fire("Error", "No se pudo eliminar el movimiento.", "error");
      }
    }
  };

  const handleEdit = async (movimiento: MovimientoMaterial) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Movimiento",
      html: `
        <input id="tipo" class="swal2-input" placeholder="Tipo (Entrada o Salida)" value="${movimiento.tipo}">
        <input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad" value="${movimiento.cantidad}">
        <input id="fecha" type="date" class="swal2-input" value="${movimiento.fecha.split('T')[0]}">
        <input id="id_producto" type="number" class="swal2-input" placeholder="ID Producto" value="${movimiento.id_producto}">
        <input id="id_usuario" type="number" class="swal2-input" placeholder="ID Usuario" value="${movimiento.id_usuario}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const getInput = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
        return {
          tipo: getInput('tipo'),
          cantidad: Number(getInput('cantidad')),
          fecha: getInput('fecha'),
          id_producto: Number(getInput('id_producto')),
          id_usuario: Number(getInput('id_usuario')),
        };
      },
    });

    if (formValues) {
      try {
        await updateMovimiento(movimiento.id, formValues);
        await cargarMovimientos();
        Swal.fire("Actualizado", "Movimiento actualizado exitosamente.", "success");
      } catch (error) {
        console.error("Error actualizando movimiento:", error);
        Swal.fire("Error", "No se pudo actualizar el movimiento.", "error");
      }
    }
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Movimiento",
      html: `
        <input id="tipo" class="swal2-input" placeholder="Tipo (Entrada o Salida)">
        <input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad">
        <input id="fecha" type="date" class="swal2-input">
        <input id="id_producto" type="number" class="swal2-input" placeholder="ID Producto">
        <input id="id_usuario" type="number" class="swal2-input" placeholder="ID Usuario">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const getInput = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
        return {
          tipo: getInput('tipo'),
          cantidad: Number(getInput('cantidad')),
          fecha: getInput('fecha'),
          id_producto: Number(getInput('id_producto')),
          id_usuario: Number(getInput('id_usuario')),
        };
      },
    });

    if (formValues) {
      try {
        await createMovimiento(formValues);
        await cargarMovimientos();
        Swal.fire("Creado", "Movimiento creado exitosamente.", "success");
      } catch (error) {
        console.error("Error creando movimiento:", error);
        Swal.fire("Error", "No se pudo crear el movimiento.", "error");
      }
    }
  };

  const getTipoTexto = (tipo: any) => {
    if (tipo === 1 || tipo === "1" || tipo === "Entrada") {
      return "Entrada";
    }
    return "Salida";
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <Card className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Movimientos de Materiales</h1>
            <Button onClick={handleCreate} size="sm">
              Nuevo Movimiento
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm table-auto border border-gray-300">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {["Tipo", "Cantidad", "Fecha", "Producto ID", "Usuario ID", "Acciones"].map((header) => (
                    <th key={header} className="px-4 py-3 text-center font-bold">
                      {header}
                    </th>
                  ))}
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
                    <tr key={movimiento.id} className="hover:bg-gray-100">
                      <td className="px-4 py-3 text-center">{getTipoTexto(movimiento.tipo)}</td>
                      <td className="px-4 py-3 text-center">{movimiento.cantidad}</td>
                      <td className="px-4 py-3 text-center">{new Date(movimiento.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center">{movimiento.id_producto}</td>
                      <td className="px-4 py-3 text-center">{movimiento.id_usuario}</td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <Button 
                          onClick={() => handleEdit(movimiento)} 
                          size="sm" 
                          className="bg-yellow-400 hover:bg-yellow-500 text-white"
                        >
                          Editar
                        </Button>
                        <Button 
                          onClick={() => handleDelete(movimiento.id)} 
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Eliminar
                        </Button>
                      </td>
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
