import { Link } from "@heroui/link";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans overflow-hidden">
      
      <header className="bg-[#1e293b] px-6 py-4 shadow-md border-b border-[#334155] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/src/img/log.png"
            alt="Logo"
            className="h-10 w-10 rounded-full border border-[#22d3ee] shadow"
          />
          <span className="text-2xl font-bold tracking-wide text-[#22d3ee]">
            INNOVASOFT
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto px-6 py-10 bg-[#0f172a]">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#1e293b] border-t border-[#334155] py-4 text-center text-sm text-[#cbd5e1]">
        <Link
          isExternal
          className="inline-flex items-center gap-1 text-current hover:text-[#22d3ee] transition-colors"
          href="https://heroui.com"
          title="Página de inicio de INNOVASOFT"
        >
          <span>Desarrollado por</span>
          <p className="text-[#22d3ee] font-semibold">MARIA RICO</p>
        </Link>
      </footer>
    </div>
  );
}
