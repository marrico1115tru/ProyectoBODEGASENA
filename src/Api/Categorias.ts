import axiosInstance from "./../Api/axios"; // Asegúrate de que la ruta a tu instancia de axios sea la correcta
import {
  CategoriaProducto,
  CategoriaProductoFormValues,
} from "@/types/types/categorias"; // Esta importación se mantiene igual

// La URL base y la configuración de withCredentials ya no son necesarias aquí,
// ya que están centralizadas en tu instancia de axios.
// const API_URL = "http://localhost:3000/categorias-productos";
// const config = {
//   withCredentials: true,
// };

export const getCategoriasProductos = async (): Promise<CategoriaProducto[]> => {
  // Se utiliza la ruta relativa, axiosInstance agregará la baseURL
  const res = await axiosInstance.get("/categorias-productos");
  return res.data;
};

export const createCategoriaProducto = async (
  data: CategoriaProductoFormValues
): Promise<CategoriaProducto> => {
  const res = await axiosInstance.post("/categorias-productos", data);
  return res.data;
};

export const updateCategoriaProducto = async (
  id: number,
  data: CategoriaProductoFormValues
): Promise<CategoriaProducto> => {
  const res = await axiosInstance.put(`/categorias-productos/${id}`, data);
  return res.data;
};

export const deleteCategoriaProducto = async (
  id: number
): Promise<void> => {
  // Ya no se pasa 'config' como argumento
  await axiosInstance.delete(`/categorias-productos/${id}`);
};