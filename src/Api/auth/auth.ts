import axios from "axios";

export async function login({ email, password }: { email: string; password: string }) {
  const res = await axios.post(
    "/auth/login",
    { email, password },
    {
      withCredentials: true, // asegura que las cookies se guarden si las usas
    }
  );

  const { user } = res.data;

  if (!user) {
    throw new Error("Respuesta del servidor incompleta");
  }

  return {
    usuario: user, // lo renombramos para que el frontend lo maneje igual
    permisos: [], // si no tienes permisos explícitos, retornas un array vacío o lo que necesites
  };
}
