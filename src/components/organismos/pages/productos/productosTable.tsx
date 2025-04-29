import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DefaultLayout from '@/layouts/default';
import Swal from 'sweetalert2';
import { fetchProductos, createProducto, updateProducto, deleteProducto, Producto } from '@/Api/Productosform';

const ProductosTable = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await fetchProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
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
        await deleteProducto(id);
        await cargarProductos();
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando producto:", error);
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
  };

  const handleEdit = async (producto: Producto) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Producto",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
        <input id="codigo_sena" class="swal2-input" placeholder="Código SENA" value="${producto.codigo_sena}">
        <input id="descripcion" class="swal2-input" placeholder="Descripción" value="${producto.descripcion}">
        <input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad" value="${producto.cantidad}">
        <input id="unidad_medida" class="swal2-input" placeholder="Unidad" value="${producto.unidad_medida}">
        <input id="tipo_material" class="swal2-input" placeholder="Tipo Material" value="${producto.tipo_material}">
        <input id="id_area" type="number" class="swal2-input" placeholder="Área" value="${producto.id_area}">
        <input id="id_categoria" type="number" class="swal2-input" placeholder="Categoría" value="${producto.id_categoria}">
        <input id="fecha_caducidad" type="date" class="swal2-input" value="${producto.fecha_caducidad}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const getInput = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
        return {
          nombre: getInput('nombre'),
          codigo_sena: getInput('codigo_sena'),
          descripcion: getInput('descripcion'),
          cantidad: Number(getInput('cantidad')),
          unidad_medida: getInput('unidad_medida'),
          tipo_material: getInput('tipo_material'),
          id_area: Number(getInput('id_area')),
          id_categoria: Number(getInput('id_categoria')),
          fecha_caducidad: getInput('fecha_caducidad'),
        };
      },
    });

    if (formValues) {
      try {
        await updateProducto(producto.id, formValues);
        await cargarProductos();
        Swal.fire("Actualizado", "Producto actualizado exitosamente.", "success");
      } catch (error) {
        console.error("Error actualizando producto:", error);
        Swal.fire("Error", "No se pudo actualizar el producto.", "error");
      }
    }
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Producto",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre">
        <input id="codigo_sena" class="swal2-input" placeholder="Código SENA">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
        <input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad">
        <input id="unidad_medida" class="swal2-input" placeholder="Unidad">
        <input id="tipo_material" class="swal2-input" placeholder="Tipo Material">
        <input id="id_area" type="number" class="swal2-input" placeholder="Área">
        <input id="id_categoria" type="number" class="swal2-input" placeholder="Categoría">
        <input id="fecha_caducidad" type="date" class="swal2-input">
      `,
      focusConfirm: false,
      confirmButtonText:'Guardar',
      preConfirm: () => {
        const getInput = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
        return {
          nombre: getInput('nombre'),
          codigo_sena: getInput('codigo_sena'),
          descripcion: getInput('descripcion'),
          cantidad: Number(getInput('cantidad')),
          unidad_medida: getInput('unidad_medida'),
          tipo_material: getInput('tipo_material'),
          id_area: Number(getInput('id_area')),
          id_categoria: Number(getInput('id_categoria')),
          fecha_caducidad: getInput('fecha_caducidad'),
        };
      },
    });

    if (formValues) {
      try {
        await createProducto(formValues);
        await cargarProductos();
        Swal.fire("Creado", "Producto creado exitosamente.", "success");
      } catch (error) {
        console.error("Error creando producto:", error);
        Swal.fire("Error", "No se pudo crear el producto.", "error");
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        <Card className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
            <Button onClick={handleCreate} size="sm">Nuevo Producto</Button>
          </div>
          <div className="mt-4">
            <table className="w-full text-xs table-auto border border-gray-300">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {[
                    "Nombre", "Código SENA", "Descripción", "Cantidad",
                    "Unidad", "Tipo Material", "Área", "Categoría", "Caducidad", "Acciones"
                  ].map((header) => (
                    <th key={header} className="px-2 py-2 text-center font-bold truncate">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center p-4 text-gray-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  productos.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-100">
                      <td className="px-2 py-2 text-center">{producto.nombre}</td>
                      <td className="px-2 py-2 text-center">{producto.codigo_sena}</td>
                      <td className="px-2 py-2 text-center">{producto.descripcion}</td>
                      <td className="px-2 py-2 text-center">{producto.cantidad}</td>
                      <td className="px-2 py-2 text-center">{producto.unidad_medida}</td>
                      <td className="px-2 py-2 text-center">{producto.tipo_material}</td>
                      <td className="px-2 py-2 text-center">{producto.id_area}</td>
                      <td className="px-2 py-2 text-center">{producto.id_categoria}</td>
                      <td className="px-2 py-2 text-center">{producto.fecha_caducidad}</td>
                      <td className="px-2 py-2 flex justify-center gap-2">
                        <Button onClick={() => handleEdit(producto)} size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-white">Editar</Button>
                        <Button onClick={() => handleDelete(producto.id)} size="sm" className="bg-red-500 hover:bg-red-600 text-white">Eliminar</Button>
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

export default ProductosTable;
