const API_URL = "http://localhost:3500/API/Usuarios";

// Obtener todos los usuarios
export const getUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }
  return response.json();
};

// Crear un nuevo usuario
export const createUser = async (userData: {
  apellidos: string;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  cargo: string;
  id_area: number;
  id_ficha: number;
}) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Error al crear el usuario");
  }
  return response.json();
};

// Eliminar usuario
export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el usuario");
  }
  return response.json();
};

// Actualizar usuario
export const updateUser = async (
  id: number,
  updatedUserData: {
    apellidos?: string;
    nombre?: string;
    cedula?: string;
    email?: string;
    telefono?: string;
    cargo?: string;
    id_area?: number;
    id_ficha?: number;
  }
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUserData),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el usuario");
  }
  return response.json();
};
