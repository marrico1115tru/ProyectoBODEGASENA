// src/pages/ProductoPage.tsx
import React, { useEffect, useState } from 'react';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '@/Api/Productosform';
import { Producto } from '@/types/types/typesProductos';

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
  const [editando, setEditando] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

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
      cargarProductos();
    } catch (error) {
      console.error("❌ Error al guardar producto:", error);
    }
  };

  const handleEdit = (producto: Producto) => {
    setForm(producto);
    setEditando(true);
    setIdEditando(producto.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProducto(id);
      cargarProductos();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input type="text" name="codigoSena" placeholder="Código SENA" value={form.codigoSena} onChange={handleChange} required className="input" />
        <input type="text" name="unspc" placeholder="UNSPC" value={form.unspc} onChange={handleChange} className="input" />
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
        <input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="input" />
        <input type="number" name="cantidad" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} required className="input" />
        <input type="text" name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} required className="input" />
        <input type="text" name="tipoMateria" placeholder="Tipo Materia" value={form.tipoMateria} onChange={handleChange} required className="input" />
        <input type="number" name="areaId" placeholder="Área ID" value={form.areaId} onChange={handleChange} required className="input" />
        <input type="date" name="fechaVencimiento" value={form.fechaVencimiento || ''} onChange={handleChange} className="input" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {editando ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Código SENA</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Cantidad</th>
            <th className="border px-2 py-1">Categoría</th>
            <th className="border px-2 py-1">Área</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td className="border px-2 py-1">{prod.id}</td>
              <td className="border px-2 py-1">{prod.codigoSena}</td>
              <td className="border px-2 py-1">{prod.nombre}</td>
              <td className="border px-2 py-1">{prod.cantidad}</td>
              <td className="border px-2 py-1">{prod.categoria}</td>
              <td className="border px-2 py-1">{prod.areaId}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(prod)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Editar</button>
                <button onClick={() => handleDelete(prod.id!)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
