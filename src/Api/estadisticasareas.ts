
import axios from "axios";

export const obtenerEstadisticasAreas = async () => {
  try {
    const res = await axios.get("http://localhost:3500/API/Areas");

    const agrupadas = {};

    res.data.forEach((area) => {
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
