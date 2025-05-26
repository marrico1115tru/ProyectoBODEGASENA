import axios, { AxiosError } from "axios";
import { Area } from "@/types/types/typesArea";

/* ------------------------------------------------------------------ */
/* Axios instance con baseURL configurable por variable de entorno    */
/* ------------------------------------------------------------------ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** 
 * Algunos endpoints devuelven { data: [...] } y otros simplemente [...]
 * Esto lo normaliza para que SIEMPRE obtengamos el array u objeto directo.
 */
const unwrap = <T>(raw: any): T => {
  if (Array.isArray(raw)) return raw as T;
  if (raw && "data" in raw) return raw.data as T;
  return raw as T;
};

/**
 * Elimina claves internas de React (ej. id local) y vacías antes de enviar.
 */
const toBackendPayload = (area: Partial<Area>) => {
  const { id, ...rest } = area; // Nunca mandamos el id dentro del body
  // Quita propiedades undefined o vacías
  return Object.fromEntries(
    Object.entries(rest).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        (typeof value !== "string" || value.trim() !== "")
    )
  );
};

/* ------------------------------------------------------------------ */
/* CRUD                                                               */
/* ------------------------------------------------------------------ */

export const getAreas = async (): Promise<Area[]> => {
  const res = await api.get("/areas");
  return unwrap<Area[]>(res.data);
};

export const createArea = async (
  area: Omit<Area, "id">
): Promise<Area> => {
  const res = await api.post("/areas", toBackendPayload(area));
  return unwrap<Area>(res.data);
};

export const updateArea = async (
  id: number,
  area: Partial<Area>
): Promise<Area> => {
  try {
    const res = await api.patch(`/areas/${id}`, toBackendPayload(area));
    return unwrap<Area>(res.data);
  } catch (err) {
    const axiosErr = err as AxiosError<any>;
    // Reenvía mensaje de Nest si existe
    const msg =
      axiosErr.response?.data?.message ??
      axiosErr.response?.data ??
      axiosErr.message;
    throw new Error(
      `No se pudo actualizar el área (id ${id}): ${msg}`
    );
  }
};

export const deleteArea = async (id: number): Promise<void> => {
  await api.delete(`/areas/${id}`);
};
