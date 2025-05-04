export async function getCentroFormacionStatistics(startDate: string, endDate: string) {
  const res = await fetch(`/api/estadisticas/centrosFormacion?start=${startDate}&end=${endDate}`);
  if (!res.ok) throw new Error("Error al obtener estadísticas");
  return res.json();
}
