
import axios from "axios";

export const obtenerEstadisticasAreas = async () => {
  try {
    const res = await axios.get("http://localhost:3500/API/Areas");

    const agrupadas: { [key: string]: number } = {};

    res.data.forEach((area: { centro_formacion: { nombre: any; }; }) => {
      const nombreCentro = area.centro_formacion.nombre;
      agrupadas[nombreCentro] = (agrupadas[nombreCentro] || 0) + 1;
    });

    const resultado = Object.entries(agrupadas).map(([nombreCentro, totalAreas]) => ({
      nombreCentro,
      totalAreas,
    }));

    return resultado;
  } catch (error) {
    console.error("Error al obtener las estadísticas de áreas:", error);
    return [];
  }
};
