import { Link } from "@heroui/link";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row min-h-screen bg-[#0f172a] text-gray-100 overflow-hidden">
      {/* Sidebar opcional aquí si lo tuvieras */}

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-[#1e293b] px-6 py-4 shadow-md border-b border-blue-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/src/img/log.png"
              alt="Logo"
              className="h-9 w-9 rounded-full border border-blue-400 shadow-md"
            />
            <span className="text-2xl font-bold tracking-wide text-blue-400">
              INNOVASOFT
            </span>
          </div>
          {}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-6 py-10 bg-[#0f172a]">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-blue-900 bg-[#1e293b] py-4 text-center text-sm text-gray-400">
          <Link
            isExternal
            className="inline-flex items-center gap-1 text-current hover:text-blue-300 transition-colors"
            href="https://heroui.com"
            title="Página de inicio de INNOVASOFT"
          >
            <span>Desarrollado por</span>
            <p className="text-blue-400 font-semibold">MARIA RICO</p>
          </Link>
        </footer>
      </div>
    </div>
  );
}
