import { useState } from "react";
import { Home, Menu, FileText, ChevronDown, ChevronUp, PackagePlus, Users, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex">
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } h-screen bg-gray-900 text-white transition-all duration-300 p-4 flex flex-col`}
      >
        {/* Botón para colapsar */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>

        {/* Navegación */}
        <nav className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 justify-start"
            onClick={() => navigate("/")}
          >
            <Home />
            {isOpen && "Home"}
          </Button>

          <Button
            variant="ghost"
            className="flex items-center gap-2 justify-start"
            onClick={() => navigate("/inicio")}
          >
            <FileText />
            {isOpen && "Inicio"}
          </Button>

          {/* Desplegable de Productos */}
          <div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 justify-between w-full"
              onClick={() => setShowProductsSubmenu(!showProductsSubmenu)}
            >
              <div className="flex items-center gap-2">
                <FileText />
                {isOpen && "Productos"}
              </div>
              {isOpen &&
                (showProductsSubmenu ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </Button>

            {showProductsSubmenu && isOpen && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className={`justify-start ${
                    location.pathname === "/products/categories" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/products/categories")}
                >
                  <PackagePlus className="w-4 h-4 mr-2" />
                  Categorias
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start ${
                    location.pathname === "/products/proveedores" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/products/proveedores")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Proveedores
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start ${
                    location.pathname === "/products/caducidad" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/products/caducidad")}
                >
                  <CalendarClock className="w-4 h-4 mr-2" />
                  Fechas de Caducidad
                </Button>
              </div>
            )}
          </div>

          {/* Desplegable de Reportes */}
          <div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 justify-between w-full"
              onClick={() => setShowReports(!showReports)}
            >
              <div className="flex items-center gap-2">
                <FileText />
                {isOpen && "Reportes"}
              </div>
              {isOpen &&
                (showReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </Button>

            {showReports && isOpen && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className={`justify-start ${
                    location.pathname === "/reports" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/reports")}
                >
                  Ventas
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start ${
                    location.pathname === "/reports/inventario" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/reports/inventario")}
                >
                  Inventario
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start ${
                    location.pathname === "/reports/usuarios" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/reports/usuarios")}
                >
                  Usuarios
                </Button>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
