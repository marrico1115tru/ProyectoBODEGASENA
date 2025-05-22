import React, { useEffect, useState } from 'react';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '@/Api/Productosform';
import { Producto } from '@/types/types/typesProductos';
import DefaultLayout from '@/layouts/default';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';

const initialFormState: Producto = {
  codigoSena: '',
  unspc: '',
  nombre: '',
  descripcion: '',
  cantidad: 0,
  categoria: '',
  tipoMateria: '',
  areaId: 1,
  fechaVencimiento: '',
  fechaInicial: '',
  fechaFinal: ''
};

export default function ProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<Producto>(initialFormState);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando && idEditando !== null) {
        await updateProducto(idEditando, form);
      } else {
        await createProducto(form);
      }
      setForm(initialFormState);
      setEditando(false);
      setIdEditando(null);
      setModalOpen(false);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEdit = (producto: Producto) => {
    setForm(producto);
    setEditando(true);
    setIdEditando(producto.id || null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProducto(id);
      cargarProductos();
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <PlusIcon className="w-5 h-5" />
                Crear
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editando ? 'Editar Producto' : 'Crear Producto'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Código SENA</label>
                  <input type="text" name="codigoSena" value={form.codigoSena} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">UNSPC</label>
                  <input type="text" name="unspc" value={form.unspc} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Nombre</label>
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Descripción</label>
                  <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Cantidad</label>
                  <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Categoría</label>
                  <input type="text" name="categoria" value={form.categoria} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tipo de Materia</label>
                  <input type="text" name="tipoMateria" value={form.tipoMateria} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Área ID</label>
                  <input type="number" name="areaId" value={form.areaId} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Fecha de Vencimiento</label>
                  <input type="date" name="fechaVencimiento" value={form.fechaVencimiento || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="col-span-2">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                    {editando ? 'Actualizar Producto' : 'Crear Producto'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full bg-white border border-gray-200 text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Código SENA</th>
                <th className="p-3 border-b">Nombre</th>
                <th className="p-3 border-b">Cantidad</th>
                <th className="p-3 border-b">Categoría</th>
                <th className="p-3 border-b">Área</th>
                <th className="p-3 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod, idx) => (
                <tr key={prod.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 border-b">{prod.id}</td>
                  <td className="p-3 border-b">{prod.codigoSena}</td>
                  <td className="p-3 border-b">{prod.nombre}</td>
                  <td className="p-3 border-b">{prod.cantidad}</td>
                  <td className="p-3 border-b">{prod.categoria}</td>
                  <td className="p-3 border-b">{prod.areaId}</td>
                  <td className="p-3 border-b flex justify-center gap-2">
                    <Button onClick={() => handleEdit(prod)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded-md shadow-sm">
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(prod.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md shadow-sm">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-500">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
