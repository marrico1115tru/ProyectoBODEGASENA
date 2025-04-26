import { useEffect, useState, Fragment } from 'react';
import { fetchProductos, createProducto, updateProducto, deleteProducto, Producto } from '@/Api/Productosform';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import DefaultLayout from '@/layouts/default';

export default function ProductosTable() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState<Omit<Producto, 'id'>>(inicializarProducto());

  function inicializarProducto() {
    return {
      codigo_sena: '',
      unspc: '',
      nombre: '',
      descripcion: '',
      cantidad: 0,
      unidad_medida: '',
      tipo_material: '',
      id_area: 0,
      id_categoria: 0,
      fecha_caducidad: '',
    };
  }

  const cargarProductos = async () => {
    try {
      const data = await fetchProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: ['cantidad', 'id_area', 'id_categoria'].includes(name) ? Number(value) : value,
    }));
  };

  const handleGuardarProducto = async () => {
    try {
      if (productoEditando) {
        await updateProducto(productoEditando.id, nuevoProducto);
      } else {
        await createProducto(nuevoProducto);
      }
      cargarProductos();
      cerrarModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      try {
        await deleteProducto(id);
        cargarProductos();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setNuevoProducto({
      codigo_sena: producto.codigo_sena,
      unspc: producto.unspc,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
      unidad_medida: producto.unidad_medida,
      tipo_material: producto.tipo_material,
      id_area: producto.id_area,
      id_categoria: producto.id_categoria,
      fecha_caducidad: producto.fecha_caducidad,
    });
    setIsOpen(true);
  };

  const cerrarModal = () => {
    setIsOpen(false);
    setProductoEditando(null);
    setNuevoProducto(inicializarProducto());
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Productos</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Crear
          </button>
        </div>

        <div className="w-full overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {['Código Sena', 'UNSPC', 'Nombre', 'Descripción', 'Cantidad', 'Unidad', 'Tipo Material', 'Área', 'Categoría', 'Caducidad', 'Acciones'].map((header) => (
                  <th key={header} className="px-2 py-2 whitespace-nowrap text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-t hover:bg-gray-50 text-center">
                  <td className="px-2 py-1 truncate">{producto.codigo_sena}</td>
                  <td className="px-2 py-1 truncate">{producto.unspc}</td>
                  <td className="px-2 py-1 truncate">{producto.nombre}</td>
                  <td className="px-2 py-1 truncate">{producto.descripcion}</td>
                  <td className="px-2 py-1">{producto.cantidad}</td>
                  <td className="px-2 py-1">{producto.unidad_medida}</td>
                  <td className="px-2 py-1">{producto.tipo_material}</td>
                  <td className="px-2 py-1">{producto.id_area}</td>
                  <td className="px-2 py-1">{producto.id_categoria}</td>
                  <td className="px-2 py-1">{producto.fecha_caducidad}</td>
                  <td className="px-2 py-1 flex justify-center gap-1">
                    <button
                      onClick={() => handleEditar(producto)}
                      className="bg-yellow-400 text-white p-1.5 rounded hover:bg-yellow-500"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(producto.id)}
                      className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={cerrarModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                    {productoEditando ? 'Editar Producto' : 'Crear Producto'}
                  </Dialog.Title>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(nuevoProducto).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-700 capitalize mb-1">
                          {key.replace('_', ' ')}
                        </label>
                        <input
                          type={
                            ['cantidad', 'id_area', 'id_categoria'].includes(key)
                              ? 'number'
                              : key === 'fecha_caducidad'
                              ? 'date'
                              : 'text'
                          }
                          name={key}
                          value={value as any}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 shadow-sm text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={cerrarModal}
                      className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleGuardarProducto}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      {productoEditando ? 'Guardar' : 'Crear'}
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </DefaultLayout>
  );
}
