import axios from "axios";
import { Area } from "@/types/types/typesArea";

const API_URL = "http://localhost:3000/areas";

// ✅ Obtener todas las áreas
export const getAreas = async (): Promise<Area[]> => {
  try {
    const res = await axios.get(API_URL);
    const data = res.data?.data;

    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("⚠️ La respuesta no es un arreglo:", res.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error al obtener áreas:", error);
    return [];
  }
};

// ✅ Crear nueva área
export const createArea = async (data: Partial<Area>): Promise<Area | null> => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data?.data ?? null;
  } catch (error) {
    console.error("❌ Error al crear área:", error);
    return null;
  }
};

// ✅ Actualizar área existente
export const updateArea = async (id: number, data: Partial<Area>): Promise<Area | null> => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data?.data ?? null;
  } catch (error) {
    console.error(`❌ Error al actualizar área con ID ${id}:`, error);
    return null;
  }
};

// ✅ Eliminar un área
export const deleteArea = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al eliminar área con ID ${id}:`, error);
    return false;
  }
};
