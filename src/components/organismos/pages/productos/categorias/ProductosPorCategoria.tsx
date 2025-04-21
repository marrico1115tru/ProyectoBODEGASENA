// src/pages/ProductosPorCategoria.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import ProductForm from "@/components/organismos/pages/productos/categorias/ProductForm";
import ProductTable from "@/components/organismos/pages/productos/categorias/ProductTable";
import AddProductButton from "@/components/molecula/AddProductButton";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  tipo_material: string;
  codigo_sena: string;
  id_categoria: number;
  id_area: number;
}

export default function ProductosPorCategoria() {
  const { categoria } = useParams<{ categoria: string }>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchProductos = async () => {
    try {
      const res = await fetch(`/api/productos?categoria=${categoria}`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [categoria]);

  const handleAddProduct = async (producto: Omit<Producto, "id">) => {
    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...producto,
          tipo_material: categoria,
        }),
      });
      const nuevo = await res.json();
      setProductos((prev) => [...prev, nuevo]);
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = async (producto: Producto) => {
    const res = await fetch(`/api/productos/${producto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    const actualizado = await res.json();
    setProductos((prev) =>
      prev.map((p) => (p.id === actualizado.id ? actualizado : p))
    );
  };

  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">📦 Productos: {categoria}</h1>
        <AddProductButton onClick={() => setShowForm(true)} />
        {showForm && <ProductForm onSubmit={handleAddProduct} />}
        <ProductTable
          products={productos}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </DefaultLayout>
  );
}
