const API_URL = "http://localhost:3500/api/Bodega";

interface BodegaData {
  nombre: string;
  ubicacion: string;
}

export const getBodegas = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener bodegas");
  }
  return response.json();
};

export const createBodega = async (bodega: BodegaData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodega),
  });

  if (!response.ok) {
    throw new Error("Error al crear bodega");
  }
  return response.json();
};

export const updateBodega = async (id: number, bodega: BodegaData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodega),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar bodega");
  }
  return response.json();
};

export const deleteBodega = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar bodega");
  }
  return response.json();
};
