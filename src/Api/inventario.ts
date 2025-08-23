import axios from "axios";
import {
  Inventario,
  InventarioFormValues,
} from "@/types/types/inventario";

const API_URL = "http://localhost:3000/inventario";


const config = {
  withCredentials: true,
};

export const getInventarios = async (): Promise<Inventario[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createInventario = async (
  data: InventarioFormValues
): Promise<Inventario> => {
  const res = await axios.post(
    API_URL,
    {
      stock: data.stock,
      fkSitio: { id: data.fkSitioId },
      idProducto: { id: data.idProductoId },
    },
    config
  );
  return res.data;
};

export const updateInventario = async (
  id: number,
  data: InventarioFormValues
): Promise<Inventario> => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    {
      stock: data.stock,
      fkSitio: { id: data.fkSitioId },
      idProducto: { id: data.idProductoId },
    },
    config
  );
  return res.data;
};

export const deleteInventario = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
