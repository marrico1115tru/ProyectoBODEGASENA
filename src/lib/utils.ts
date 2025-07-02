import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getDecodedTokenFromCookies(cookieName: string) {
    const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
    if (!match) return null;

    const token = match[2];
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Token inválido:', error);
      return null;
    }
  }