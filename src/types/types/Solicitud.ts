export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
}

export interface Solicitud {
  id: number;
  fechaSolicitud: string;
  estadoSolicitud: string | null;
  idUsuarioSolicitante: Usuario;
}

export interface SolicitudPayload {
  fechaSolicitud: string;
  estadoSolicitud: string;
  idUsuarioSolicitante: {
    id: number;
  };
}