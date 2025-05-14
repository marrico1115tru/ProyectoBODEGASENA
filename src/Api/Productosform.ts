// src/api.ts
import axios from 'axios';
import { Producto } from '@/types/types'; // Ajusta la ruta si está en otro lugar

const API_URL = 'http://localhost:3500/api/productos';

export const getProductos = async (): Promise<Producto[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createProducto = async (producto: Producto): Promise<Producto> => {
  const response = await axios.post(API_URL, producto);
  return response.data;
};

export const updateProducto = async (id: number, producto: Producto): Promise<Producto> => {
  const response = await axios.put(`${API_URL}/${id}`, producto);
  return response.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
