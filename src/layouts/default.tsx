import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-md border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="src/img/log.png"
            
            className="h-8 w-8 rounded-full border border-blue-200 shadow-sm"
          />
          <span className="text-xl font-bold tracking-wide text-blue-800 drop-shadow-sm">
            INNOVASOFT
          </span>
        </div>
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-4 text-center text-sm text-gray-500">
        <Link
          isExternal
          className="inline-flex items-center gap-1 text-current hover:text-blue-600 transition-colors"
          href="https://heroui.com"
          title="Página de inicio de heroui.com"
        >
          <span>Desarrollado por</span>
          <p className="text-blue-600 font-semibold">HeroUI</p>
        </Link>
      </footer>
    </div>
  );
}
