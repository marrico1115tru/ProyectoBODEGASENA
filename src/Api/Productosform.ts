// src/Api/Productosform.ts
import api from "@/lib/axios"; // Usa la instancia que maneja cookies
import { Producto, ProductoFormValues } from "@/types/types/typesProductos";

const API_URL = "/productos"; // SIN localhost

export const getProductos = async (): Promise<Producto[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const createProducto = async (data: ProductoFormValues): Promise<Producto> => {
  const res = await api.post(API_URL, {
    ...data,
    idCategoria: { id: data.idCategoriaId },
  });
  return res.data;
};

export const updateProducto = async (id: number, data: ProductoFormValues): Promise<Producto> => {
  const res = await api.put(`${API_URL}/${id}`, {
    ...data,
    idCategoria: { id: data.idCategoriaId },
  });
  return res.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
