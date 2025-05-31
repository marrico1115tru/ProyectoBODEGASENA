// src/layouts/DefaultLayout.tsx
import Sidebar from "@/components/organismos/Sidebar/Sidebar";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
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

          {/* Botón de perfil */}
          <Link to="/Perfil">
            <div
              className="flex items-center space-x-2 text-white hover:text-cyan-300 transition-colors cursor-pointer"
              title="Ver perfil"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Perfil</span>
            </div>
          </Link>
        </header>

        <main className="flex-1 overflow-auto px-6 py-8 bg-slate-100">{children}</main>

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
