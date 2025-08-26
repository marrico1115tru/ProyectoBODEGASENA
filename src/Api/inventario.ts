import axiosInstance from "./../Api/axios";
import {
  Inventario,
  InventarioCreatePayload,
  InventarioUpdatePayload
} from "@/types/types/inventario";

export const getInventarios = async (): Promise<Inventario[]> => {
  const res = await axiosInstance.get("/inventario");
  return res.data;
};

export const createInventario = async (
  data: InventarioCreatePayload // ¡Ya corregido!
): Promise<Inventario> => {
  const res = await axiosInstance.post(
    "/inventario",
    {
      stock: data.stock,
      fkSitioId: data.fkSitioId,
      idProductoId: data.idProductoId,
      placaSena: data.placaSena ? data.placaSena : undefined,
    }
  );
  return res.data;
};

export const updateInventario = async (
  id: number,
  data: InventarioUpdatePayload // ¡Ya corregido!
): Promise<Inventario> => {
  const res = await axiosInstance.put(
    `/inventario/${id}`,
    {
      stock: data.stock,
      fkSitioId: data.fkSitioId,
      idProductoId: data.idProductoId,
      placaSena: data.placaSena ? data.placaSena : undefined,
    }
  );
  return res.data;
};

export const deleteInventario = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/inventario/${id}`);
};
