export async function getCentroFormacionStatistics(startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `/api/CentroFormacion/estadisticas?startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener estadísticas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getCentroFormacionStatistics:", error);
    throw error;
  }
}
