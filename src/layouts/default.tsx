import Sidebar from "@/components/organismos/Sidebar/Sidebar";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { logout as cerrarSesionApi, getProfile } from "@/Api/auth/auth";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // 🔐 Obtener usuario desde backend usando la cookie
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const user = await getProfile(); // 🍪 usa token desde cookie
        setUsuario(user);
      } catch (err) {
        console.error("🔴 Usuario no autenticado, redirigiendo...");
        navigate("/login"); // redirigir si no hay sesión
      }
    };

    cargarUsuario();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await cerrarSesionApi(); // ❌ Eliminar cookie httpOnly desde backend
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      navigate("/login"); // 🔁 Redirige al login
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-[#0f172a] px-6 py-4 shadow-md border-b border-slate-700 flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <img
              src="src/img/log.png"
              alt="Logo"
              className="h-10 w-10 rounded-full border border-white shadow-md"
            />
            <span className="text-2xl font-bold tracking-wide text-cyan-400">INNOVASOFT</span>
          </div>

          {/* Perfil y logout */}
          <div className="flex items-center space-x-4">
            <Link to="/Perfil">
              <div
                className="flex items-center space-x-2 text-white hover:text-cyan-300 transition-colors cursor-pointer"
                title="Ver perfil"
              >
                <User className="h-5 w-5" />
                {usuario && <span className="hidden sm:inline">{usuario.nombre}</span>}
              </div>
            </Link>

            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl shadow-md transition duration-200"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold">Cerrar sesión</span>
            </Button>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto px-6 py-8 bg-slate-100">{children}</main>

        {/* Footer */}
        <footer className="w-full bg-[#0f172a] border-t border-slate-700 py-4 text-center text-sm text-white">
          <a
            href="https://heroui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
            title="Página de inicio de INNOVASOFT"
          >
            <span>Desarrollado por</span>
            <p className="font-semibold text-cyan-300">MARIA RICO</p>
          </a>
        </footer>
      </div>
    </div>
  );
}
