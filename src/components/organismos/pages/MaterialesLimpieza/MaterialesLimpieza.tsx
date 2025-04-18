// src/pages/LimpiezaProductos.tsx
import { useState } from "react";
import DefaultLayout from "@/layouts/default"; // Asegúrate de que esta ruta sea correcta
import AddProductButton from "@/components/molecula/AddProductButton";
import ProductForm from "@/components/organismos/ProductForm";
import ProductTable from "@/components/organismos/pages/ProductTable";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  amount: number;
  serial: string;
}

export default function LimpiezaProductos() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Cloro",
      description: "Desinfectante multiusos",
      category: "Limpieza",
      amount: 15,
      serial: "CL-001",
    },
    {
      id: 2,
      name: "Jabón líquido",
      description: "Para limpieza de pisos",
      category: "Limpieza",
      amount: 10,
      serial: "JB-002",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
    };
    setProducts((prev) => [...prev, newProduct]);
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">🧴 Productos de Limpieza</h1>

        <AddProductButton onClick={() => setShowForm(true)} />

        {showForm && <ProductForm onSubmit={handleAddProduct} />}

        <ProductTable products={products} onDelete={handleDelete} />
      </div>
    </DefaultLayout>
  );
}
