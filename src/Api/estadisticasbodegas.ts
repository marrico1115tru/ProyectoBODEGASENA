export async function getBodegas() {
  const response = await fetch('http://localhost:3500/api/Bodega')
  if (!response.ok) {
    throw new Error('Error al obtener bodegas')
  }
  return response.json()
}
