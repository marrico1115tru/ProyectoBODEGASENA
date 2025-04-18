export interface Bodega {
  id: number;
  nombre: string;
  ubicacion: string | null;
  fecha_registro: string;
}

export const getBodegas = async (): Promise<Bodega[]> => {
  const res = await fetch('localhost:3100/API/Bodega');

  if (!res.ok) {
    throw new Error('Error al obtener las bodegas');
  }

  return res.json();
};
