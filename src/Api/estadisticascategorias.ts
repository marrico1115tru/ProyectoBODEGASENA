export const fetchCategorias = async () => {
  const response = await fetch("http://localhost:3500/API/Categoria")
  if (!response.ok) throw new Error("Error al obtener categorías")
  return response.json()
}
