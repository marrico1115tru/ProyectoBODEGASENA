export interface AreaEstadistica {
  nombreCentroFormacion: string;
  cantidadAreas: number;
}

export async function fetchAreasEstadistica(): Promise<AreaEstadistica[]> {
  const response = await fetch("http://localhost:3500/API/Areas");
  if (!response.ok) {
    throw new Error("Error al obtener los datos de áreas");
  }
  return await response.json();
}
