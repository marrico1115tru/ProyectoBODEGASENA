import axios from "axios";
import { EntregaMaterial } from "@/types/types/EntregaMaterial";

const API_URL = "http://localhost:3000/entrega-material";

export const getEntregasMaterial = async (): Promise<EntregaMaterial[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createEntregaMaterial = async (
  data: Partial<EntregaMaterial>
): Promise<EntregaMaterial> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateEntregaMaterial = async (
  id: number,
  data: Partial<EntregaMaterial>
): Promise<EntregaMaterial> => {
  const res = await axios.patch(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteEntregaMaterial = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
