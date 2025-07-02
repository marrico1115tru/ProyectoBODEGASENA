import { ProductoFormValues } from '@/types/types/typesProductos';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const getProductos = async () => {
  const res = await api.get('/productos');
  return res.data;
};

export const createProducto = async (data: ProductoFormValues) => {
  const res = await api.post('/productos', {
    ...data,
    idCategoria: { id: data.idCategoriaId },
  });
  return res.data;
};

export const updateProducto = async (id: number, data: ProductoFormValues) => {
  const res = await api.put(`/productos/${id}`, {
    ...data,
    idCategoria: { id: data.idCategoriaId },
  });
  return res.data;
};

export const deleteProducto = async (id: number) => {
  await api.delete(`/productos/${id}`);
};
