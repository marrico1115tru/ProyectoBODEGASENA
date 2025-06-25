import axios from "axios";

export async function login({ email, password }: { email: string; password: string }) {
  const res = await axios.post(
    "/auth/login",
    { email, password },
    {
      withCredentials: true, // ✅ asegurarse de que se guarden las cookies
    }
  );

  // Validar que tenga los datos esperados (sin esperar el token directamente)
  const { usuario, permisos } = res.data;

  if (!usuario || !permisos) {
    throw new Error("Respuesta del servidor incompleta");
  }

  return res.data; // contiene { usuario, permisos }
}
