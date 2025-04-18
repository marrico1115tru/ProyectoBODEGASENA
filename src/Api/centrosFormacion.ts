// src/Api/centrosFormacion.ts

export interface CentroFormacion {
    id: number;
    nombre: string;
    ubicacion: string;
    telefono: string;
    fecha_registro: string;
  }
  
  export const getCentrosFormacion = async (): Promise<CentroFormacion[]> => {
    const res = await fetch('http://localhost:3100/API/CentroFormacion');
  
    if (!res.ok) {
      throw new Error('Error al obtener los centros de formación');
    }
  
    return res.json();
  };
  