import axios from "axios";
import { Sede, SedeFormValues } from "@/types/types/Sede";

// ✅ Instancia de axios con cookies habilitadas para autenticación
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // 🔐 Necesario para enviar la cookie con el token JWT
});

// ✅ Obtener todas las sedes
export const getSedes = async (): Promise<Sede[]> => {
  const res = await api.get("/sedes");
  return res.data?.data || res.data; // Ajusta según cómo responde tu backend
};

// ✅ Crear nueva sede
export const createSede = async (data: SedeFormValues): Promise<Sede> => {
  const res = await api.post("/sedes", data);
  return res.data;
};

// ✅ Actualizar sede existente
export const updateSede = async (id: number, data: SedeFormValues): Promise<Sede> => {
  const res = await api.put(`/sedes/${id}`, data);
  return res.data;
};

// ✅ Eliminar sede
export const deleteSede = async (id: number): Promise<void> => {
  await api.delete(`/sedes/${id}`);
};
