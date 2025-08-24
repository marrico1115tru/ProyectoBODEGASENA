import axiosInstance from "./../Api/axios";
import { EntregaMaterial } from "@/types/types/EntregaMaterial"; 
export const getEntregasMaterial = async (): Promise<EntregaMaterial[]> => {
  const res = await axiosInstance.get("/entrega-material");
  return res.data;
};

export const createEntregaMaterial = async (
  data: EntregaMaterial
): Promise<EntregaMaterial> => {
  const res = await axiosInstance.post(
    "/entrega-material",
    {
      fechaEntrega: data.fechaEntrega,
      observaciones: data.observaciones,
      idFichaFormacion: { id: data.idFichaFormacion.id },
      idSolicitud: { id: data.idSolicitud.id },
      idUsuarioResponsable: { id: data.idUsuarioResponsable.id },
    }
  );
  return res.data;
};

export const updateEntregaMaterial = async (
  id: number,
  data: EntregaMaterial
): Promise<EntregaMaterial> => {
  const res = await axiosInstance.put(
    `/entrega-material/${id}`,
    {
      fechaEntrega: data.fechaEntrega,
      observaciones: data.observaciones,
      idFichaFormacion: { id: data.idFichaFormacion.id },
      idSolicitud: { id: data.idSolicitud.id },
      idUsuarioResponsable: { id: data.idUsuarioResponsable.id },
    }
  );
  return res.data;
};

export const deleteEntregaMaterial = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/entrega-material/${id}`);
};