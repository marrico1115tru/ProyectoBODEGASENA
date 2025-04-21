import { useState } from "react";

interface ProductoFormProps {
  onSubmit: (producto: Omit<Producto, "id">) => void;
  initialData?: Omit<Producto, "id">;
}

interface Producto {
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  tipo_material: string;
  codigo_sena: string;
  id_categoria: number;
  id_area: number;
}

export default function ProductForm({ onSubmit, initialData }: ProductoFormProps) {
  const [formData, setFormData] = useState<Producto>(
    initialData || {
      nombre: "",
      descripcion: "",
      cantidad: 0,
      unidad_medida: "",
      tipo_material: "",
      codigo_sena: "",
      id_categoria: 1,
      id_area: 1,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad" || name === "id_categoria" || name === "id_area"
        ? parseInt(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 grid gap-4">
      <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="border p-2 rounded" required />
      <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} className="border p-2 rounded" />
      <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} className="border p-2 rounded" />
      <input type="text" name="unidad_medida" placeholder="Unidad de Medida" value={formData.unidad_medida} onChange={handleChange} className="border p-2 rounded" />
      <input type="text" name="codigo_sena" placeholder="Código SENA" value={formData.codigo_sena} onChange={handleChange} className="border p-2 rounded" />
      <input type="number" name="id_categoria" placeholder="ID Categoría" value={formData.id_categoria} onChange={handleChange} className="border p-2 rounded" />
      <input type="number" name="id_area" placeholder="ID Área" value={formData.id_area} onChange={handleChange} className="border p-2 rounded" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Guardar producto
      </button>
    </form>
  );
}
