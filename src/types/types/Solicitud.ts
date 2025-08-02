/* Usuario “ligero” que solo lleva el id cuando se envía al backend */
export interface UsuarioRef {
  id: number;
}

/* Usuario completo que viene del backend */
export interface Usuario extends UsuarioRef {
  nombre: string;
  apellido: string;
}

/* Objeto que devuelve el backend para una solicitud */
export interface Solicitud {
  fecha: string;
  solicitante: string;
  detalleSolicituds: any;
  entregaMaterials: any;
  id: number;
  fechaSolicitud: string;
  estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | null;
  idUsuarioSolicitante: Usuario;
}

/* Objeto que **envías** al backend */
export interface SolicitudPayload {
  fechaSolicitud: string;
  estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  idUsuarioSolicitante: UsuarioRef;
}

/* Valores que maneja tu formulario */
export interface SolicitudFormValues {
  fechaSolicitud: string;
  estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  idUsuarioSolicitanteId: number;          // ⬅️ solo el id para el <Select/>
}
