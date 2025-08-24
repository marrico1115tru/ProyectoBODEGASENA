import { ProductoFormValues } from '@/types/types/typesProductos';
import axiosInstance from './../Api/axios'; // Importamos la instancia compartida



export const getProductos = async () => {
  // Reemplazamos 'api' por 'axiosInstance'
  const res = await axiosInstance.get('/productos');
  return res.data;
};

export const createProducto = async (data: ProductoFormValues) => {
  // La lógica para transformar los datos se mantiene intacta
  const res = await axiosInstance.post('/productos', {
    ...data,
    idCategoria: { id: data.idCategoriaId },
  });
  return res.data;
};

export const updateProducto = async (id: number, data: ProductoFormValues) => {
  // La lógica de transformación de datos para la actualización también se mantiene
  const res = await axiosInstance.put(`/productos/${id}`, {
    ...data,
    idCategoria: { id: data.idCategoriaId },
  });
  return res.data;
};

export const deleteProducto = async (id: number) => {
  await axiosInstance.delete(`/productos/${id}`);
};