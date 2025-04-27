import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DefaultLayout from "@/layouts/default";
import Swal from "sweetalert2";
import {
  getBodegas,
  createBodega,
  updateBodega,
  deleteBodega,
} from "@/Api/Bodegasform";

interface Bodega {
  id: number;
  nombre: string;
  ubicacion: string;
  fecha_registro: string;
}

const BodegasView = () => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);

  useEffect(() => {
    cargarBodegas();
  }, []);

  const cargarBodegas = async () => {
    try {
      const data = await getBodegas();
      setBodegas(data);
    } catch (error) {
      console.error("Error cargando bodegas:", error);
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
        await deleteBodega(id);
        await cargarBodegas();
        Swal.fire("¡Eliminado!", "La bodega ha sido eliminada.", "success");
      } catch (error) {
        console.error("Error eliminando bodega:", error);
        Swal.fire("Error", "No se pudo eliminar la bodega.", "error");
      }
    }
  };

  const handleEdit = async (bodega: Bodega) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Bodega",
      html:
        `<input id="nombre" class="swal2-input" placeholder="Nombre" value="${bodega.nombre}">` +
        `<input id="ubicacion" class="swal2-input" placeholder="Ubicación" value="${bodega.ubicacion}">`,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const ubicacion = (document.getElementById("ubicacion") as HTMLInputElement).value;

        if (!nombre || !ubicacion) {
          Swal.showValidationMessage("Por favor completa los campos.");
          return;
        }

        return { nombre, ubicacion };
      },
    });

    if (formValues) {
      try {
        await updateBodega(bodega.id, formValues);
        await cargarBodegas();
        Swal.fire("Actualizado", "La bodega ha sido actualizada.", "success");
      } catch (error) {
        console.error("Error actualizando bodega:", error);
        Swal.fire("Error", "No se pudo actualizar la bodega.", "error");
      }
    }
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Bodega",
      html:
        `<input id="nombre" class="swal2-input" placeholder="Nombre">` +
        `<input id="ubicacion" class="swal2-input" placeholder="Ubicación">`,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const ubicacion = (document.getElementById("ubicacion") as HTMLInputElement).value;

        if (!nombre || !ubicacion) {
          Swal.showValidationMessage("Por favor completa los campos.");
          return;
        }

        return { nombre, ubicacion };
      },
    });

    if (formValues) {
      try {
        await createBodega(formValues);
        await cargarBodegas();
        Swal.fire("Creado", "Bodega creada exitosamente.", "success");
      } catch (error) {
        console.error("Error creando bodega:", error);
        Swal.fire("Error", "No se pudo crear la bodega.", "error");
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8">
        <Card className="mb-6 w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Bodegas</h1>
            <Button
              onClick={handleCreate}
              className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              Crear Bodega
            </Button>
          </div>
        </Card>

        <Card className="w-full">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Ubicación</th>
                  <th className="px-6 py-3">Fecha de Registro</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bodegas.map((bodega) => (
                  <tr
                    key={bodega.id}
                    className="bg-white border-b hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-6 py-4">{bodega.nombre}</td>
                    <td className="px-6 py-4">{bodega.ubicacion}</td>
                    <td className="px-6 py-4">{new Date(bodega.fecha_registro).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => handleEdit(bodega)}
                      >
                        Editar
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white text-xs"
                        onClick={() => handleDelete(bodega.id)}
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

export default BodegasView;
