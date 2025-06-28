import axios from "axios";
import { EntregaMaterial } from "@/types/types/EntregaMaterial";

const API_URL = "http://localhost:3000/entrega-material";

// Configuración global para permitir el envío de cookies (sesión)
const config = {
  withCredentials: true,
};

export const getEntregasMaterial = async (): Promise<EntregaMaterial[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createEntregaMaterial = async (
  data: EntregaMaterial
): Promise<EntregaMaterial> => {
  const res = await axios.post(
    API_URL,
    {
      fechaEntrega: data.fechaEntrega,
      observaciones: data.observaciones,
      idFichaFormacion: { id: data.idFichaFormacion.id },
      idSolicitud: { id: data.idSolicitud.id },
      idUsuarioResponsable: { id: data.idUsuarioResponsable.id },
    },
    config
  );
  return res.data;
};

export const updateEntregaMaterial = async (
  id: number,
  data: EntregaMaterial
): Promise<EntregaMaterial> => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    {
      fechaEntrega: data.fechaEntrega,
      observaciones: data.observaciones,
      idFichaFormacion: { id: data.idFichaFormacion.id },
      idSolicitud: { id: data.idSolicitud.id },
      idUsuarioResponsable: { id: data.idUsuarioResponsable.id },
    },
    config
  );
  return res.data;
};

export const deleteEntregaMaterial = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
