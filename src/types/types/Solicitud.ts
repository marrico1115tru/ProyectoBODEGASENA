export interface Solicitud {
  id?: number;
  usuarioSolicitanteId: number;
  fechaSolicitud: string;
  estadoSolicitud: string;
  fechaInicial: string;
  fechaFinal: string;
}
