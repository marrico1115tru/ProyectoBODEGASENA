import Sidebar from "@/components/organismos/Sidebar/Sidebar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-[#0f172a] font-sans overflow-hidden">
      {/* Sidebar - solo uno */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-auto">
        <header className="bg-[#1e3a8a] px-6 py-4 shadow-md border-b border-[#1e40af] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/src/img/log.png"
              alt="Logo"
              className="h-10 w-10 rounded-full border border-white shadow-lg"
            />
            <span className="text-2xl font-bold tracking-wide text-white">INNOVASOFT</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-10 bg-[#f1f5f9]">
          {children}
        </main>

        <footer className="w-full bg-[#1e3a8a] border-t border-[#1e40af] py-4 text-center text-sm text-white">
          <a
            href="https://heroui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-[#3b82f6] transition-colors"
            title="Página de inicio de INNOVASOFT"
          >
            <span>Desarrollado por</span>
            <p className="font-semibold text-[#3b82f6]">MARIA RICO</p>
          </a>
        </footer>
      </div>
    </div>
  );
}
