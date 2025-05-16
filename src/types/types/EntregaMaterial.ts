// types.ts
export interface EntregaMaterial {
  id?: number;
  solicitudId: number;
  usuarioResponsableId: number;
  fechaEntrega: string;       // ISO string
  observaciones?: string;
  fechaInicial?: string;
  fechaFinal?: string;
  // Opcional, si quieres incluir datos anidados:
  solicitud?: any;
  usuarioResponsable?: any;
}
