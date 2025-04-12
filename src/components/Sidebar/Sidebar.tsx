import { useState } from "react";
import {
  Home,
  Menu,
  FileText,
  ChevronDown,
  ChevronUp,
  PackagePlus,
  Users,
  CalendarClock,
  BarChart2,
  PieChart,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showInfoReportsSubmenu, setShowInfoReportsSubmenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex">
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } h-screen bg-slate-800 text-slate-100 transition-all duration-300 p-4 flex flex-col shadow-lg`}
      >
        {/* Botón para colapsar */}
        <Button
          variant="ghost"
          className="mb-6 text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>

        {/* Navegación */}
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <Button
            variant="ghost"
            className={`flex items-center gap-2 justify-start hover:bg-slate-700 ${
              location.pathname === "/" ? "text-blue-400" : ""
            }`}
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            {isOpen && "Home"}
          </Button>

          <Button
            variant="ghost"
            className={`flex items-center gap-2 justify-start hover:bg-slate-700 ${
              location.pathname === "/inicio" ? "text-blue-400" : ""
            }`}
            onClick={() => navigate("/inicio")}
          >
            <FileText className="w-5 h-5" />
            {isOpen && "Inicio"}
          </Button>

          {/* Submenú Productos */}
          <div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 justify-between w-full hover:bg-slate-700"
              onClick={() => setShowProductsSubmenu(!showProductsSubmenu)}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
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
                  className={`justify-start text-left hover:text-blue-300 ${
                    location.pathname === "/categoriaspro" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/categoriaspro")}
                >
                  <PackagePlus className="w-4 h-4 mr-2" />
                  Categorías
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start text-left hover:text-blue-300 ${
                    location.pathname === "/proveedores" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/proveedores")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Proveedores
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start text-left hover:text-blue-300 ${
                    location.pathname === "/vencimiento" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/vencimiento")}
                >
                  <CalendarClock className="w-4 h-4 mr-2" />
                  Fechas de Caducidad
                </Button>
              </div>
            )}
          </div>

          {/* Submenú Estadisticas */}
          <div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 justify-between w-full hover:bg-slate-700"
              onClick={() => setShowReports(!showReports)}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {isOpen && "Estadisticas"}
              </div>
              {isOpen &&
                (showReports ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </Button>

            {showReports && isOpen && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className={`justify-start text-left hover:text-blue-300 ${
                    location.pathname === "/reports" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/Estadisticas")}
                >
                  Centros Formacion
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start text-left hover:text-blue-300 ${
                    location.pathname === "/reports/inventario" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/reports/inventario")}
                >
                  Inventario
                </Button>
                <Button
                  variant="ghost"
                  className={`justify-start text-left hover:text-blue-300 ${
                    location.pathname === "/reports/usuarios" ? "text-blue-400" : ""
                  }`}
                  onClick={() => navigate("/reports/usuarios")}
                >
                  Usuarios
                </Button>

                {/* Submenú InfoReports */}
                <div>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 justify-between w-full hover:text-blue-300"
                    onClick={() => setShowInfoReportsSubmenu(!showInfoReportsSubmenu)}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4" />
                      InfoReports
                    </div>
                    {showInfoReportsSubmenu ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </Button>

                  {showInfoReportsSubmenu && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        className={`justify-start text-left hover:text-blue-300 ${
                          location.pathname === "/reportsInfo" ? "text-blue-400" : ""
                        }`}
                        onClick={() => navigate("/reportsInfo")}
                      >
                        <List className="w-4 h-4 mr-2" />
                        Reportes centros Formacion
                      </Button>
                      <Button
                        variant="ghost"
                        className={`justify-start text-left hover:text-blue-300 ${
                          location.pathname === "reportsInfo" ? "text-blue-400" : ""
                        }`}
                        onClick={() => navigate("/reportsInfo")}
                      >
                        <PieChart className="w-4 h-4 mr-2" />
                        Gráficos
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
