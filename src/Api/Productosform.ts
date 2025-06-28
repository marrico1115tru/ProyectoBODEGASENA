import axios from "axios";
import {
  Producto,
  ProductoFormValues,
} from "@/types/types/typesProductos";

const API_URL = "http://localhost:3000/productos";

// Config global para habilitar cookies/sesión
const config = {
  withCredentials: true,
};

export const getProductos = async (): Promise<Producto[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createProducto = async (
  data: ProductoFormValues
): Promise<Producto> => {
  const res = await axios.post(
    API_URL,
    {
      ...data,
      idCategoria: { id: data.idCategoriaId }, // estructura esperada por el backend
    },
    config
  );
  return res.data;
};

export const updateProducto = async (
  id: number,
  data: ProductoFormValues
): Promise<Producto> => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    {
      ...data,
      idCategoria: { id: data.idCategoriaId },
    },
    config
  );
  return res.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
