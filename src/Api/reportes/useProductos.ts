import { z } from 'zod';

const API_URL = 'http://localhost:3500/API/reportes'; // Asegúrate que este endpoint exista

// Esquema de validación
export const productoReporteSchema = z.object({
  id_producto: z.number(),
  nombre_producto: z.string(),
  categoria: z.string(),
  tipo_material: z.string(),
  cantidad_total_solicitada: z.number().int().nonnegative(),
  unidades_disponibles: z.number().int().nonnegative(),
  area: z.string(),
  centro_formacion: z.string(),
  fecha_ultima_solicitud: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// Tipo TypeScript basado en el esquema
export type ProductoReporte = z.infer<typeof productoReporteSchema>;

// Función para obtener el reporte de productos
export const fetchReporteProductos = async (): Promise<ProductoReporte[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener el reporte de productos');
    }

    const data = await response.json();

    // Validación con Zod
    return z.array(productoReporteSchema).parse(data);
  } catch (error) {
    console.error('Error en fetchReporteProductos:', error);
    throw error;
  }
};
