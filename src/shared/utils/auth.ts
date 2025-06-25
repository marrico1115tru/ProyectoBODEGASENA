import Cookies from 'js-cookie';
import axios from 'axios';

interface Permiso {
  ruta: string;
  puede_ver: boolean;
  puede_crear: boolean;
  puede_editar: boolean;
  puede_eliminar: boolean;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

// Función de login desde el frontend
export async function iniciarSesion(email: string, password: string) {
  const response = await axios.post('http://localhost:3000/auth/login', {
    email,
    password,
  });

  const { token, usuario, permisos } = response.data;

  guardarSesion(token, usuario, permisos);
  return usuario;
}

// Guardar token y datos en cookies
export function guardarSesion(token: string, usuario: Usuario, permisos: Permiso[]) {
  Cookies.set('token', token, { expires: 1 }); // 1 día
  Cookies.set('usuario', JSON.stringify(usuario), { expires: 1 });
  Cookies.set('permisos', JSON.stringify(permisos), { expires: 1 });
}

export function cerrarSesion() {
  Cookies.remove('token');
  Cookies.remove('usuario');
  Cookies.remove('permisos');
}

export function obtenerToken(): string | undefined {
  return Cookies.get('token');
}

export function obtenerUsuario(): Usuario | null {
  const user = Cookies.get('usuario');
  return user ? JSON.parse(user) : null;
}

export function obtenerPermisos(): Permiso[] {
  const permisos = Cookies.get('permisos');
  return permisos ? JSON.parse(permisos) : [];
}

export function tienePermiso(ruta: string, tipo: keyof Permiso): boolean {
  const permisos = obtenerPermisos();
  const permisoRuta = permisos.find(p => p.ruta === ruta);
  return Boolean(permisoRuta?.[tipo]);
}
