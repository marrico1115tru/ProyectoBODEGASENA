import axiosInstance from "./../Api/axios"; 
import {
  Inventario,
  InventarioFormValues,
} from "@/types/types/inventario"; 

export const getInventarios = async (): Promise<Inventario[]> => {
  const res = await axiosInstance.get("/inventario");
  return res.data;
};

export const createInventario = async (
  data: InventarioFormValues
): Promise<Inventario> => {
  const res = await axiosInstance.post(
    "/inventario",
    {
      stock: data.stock,
      fkSitio: { id: data.fkSitioId },
      idProducto: { id: data.idProductoId },
    }
  );
  return res.data;
};

export const updateInventario = async (
  id: number,
  data: InventarioFormValues
): Promise<Inventario> => {
  const res = await axiosInstance.put(
    `/inventario/${id}`,
    {
      stock: data.stock,
      fkSitio: { id: data.fkSitioId },
      idProducto: { id: data.idProductoId },
    }
  );
  return res.data;
};

export const deleteInventario = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/inventario/${id}`);
};