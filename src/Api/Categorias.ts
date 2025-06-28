import axios from "axios";
import {
  CategoriaProducto,
  CategoriaProductoFormValues,
} from "@/types/types/categorias";

const API_URL = "http://localhost:3000/categorias-productos";

// Config global para incluir cookies/sesión si es necesario
const config = {
  withCredentials: true,
};

export const getCategoriasProductos = async (): Promise<CategoriaProducto[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createCategoriaProducto = async (
  data: CategoriaProductoFormValues
): Promise<CategoriaProducto> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateCategoriaProducto = async (
  id: number,
  data: CategoriaProductoFormValues
): Promise<CategoriaProducto> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteCategoriaProducto = async (
  id: number
): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
