const API_URL = "http://localhost:300/api/usuarios"; // Ajusta la URL según tu backend

export const getUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener usuarios");
  return await response.json();
};

export const createUser = async (userData: {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  cargo: string;
}) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Error al crear usuario");
  return await response.json();
};

export const updateUser = async (
  id: number,
  userData: {
    nombre: string;
    cedula: string;
    email: string;
    telefono: string;
    cargo: string;
  }
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Error al actualizar usuario");
  return await response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar usuario");
  return await response.json();
};
