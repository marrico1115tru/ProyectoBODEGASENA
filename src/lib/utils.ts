import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

// ✅ Utilidad para clases Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Interfaz para tipar el token JWT
interface DecodedToken {
  id: number;
  nombre: string;
  correo: string;
  rol: {
    id: number;
    nombre: string;
  };
  iat?: number;
  exp?: number;
}

// ✅ Función para obtener y decodificar el token desde cookies
export function getDecodedTokenFromCookies(cookieName: string): DecodedToken | null {
  const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
  if (!match) return null;

  const token = match[2];

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}
