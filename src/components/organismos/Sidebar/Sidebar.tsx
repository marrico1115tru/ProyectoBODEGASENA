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
import SidebarButton from "@/components/molecula/Button";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showInfoReportsSubmenu, setShowInfoReportsSubmenu] = useState(false);

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
          <SidebarButton
            to="/"
            icon={<Home className="w-5 h-5" />}
            label="Home"
            isOpen={isOpen}
            activePaths={["/"]}
          />

          <SidebarButton
            to="/inicio"
            icon={<FileText className="w-5 h-5" />}
            label="Inicio"
            isOpen={isOpen}
            activePaths={["/inicio"]}
          />

          {/* Submenú Productos */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Productos"
            isOpen={isOpen}
            onClick={() => setShowProductsSubmenu(!showProductsSubmenu)}
            endIcon={
              showProductsSubmenu ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )
            }
          />

          {showProductsSubmenu && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <SidebarButton
                to="/categoriaspro"
                icon={<PackagePlus className="w-4 h-4" />}
                label="Categorías"
                isOpen={isOpen}
                activePaths={["/categoriaspro"]}
              />
              <SidebarButton
                to="/proveedores"
                icon={<Users className="w-4 h-4" />}
                label="Proveedores"
                isOpen={isOpen}
                activePaths={["/proveedores"]}
              />
              <SidebarButton
                to="/vencimiento"
                icon={<CalendarClock className="w-4 h-4" />}
                label="Fechas de Caducidad"
                isOpen={isOpen}
                activePaths={["/vencimiento"]}
              />
            </div>
          )}

          {/* Submenú Estadísticas */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Estadísticas"
            isOpen={isOpen}
            onClick={() => setShowReports(!showReports)}
            endIcon={
              showReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
          />

          {showReports && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <SidebarButton
                to="/Estadisticas"
                label="Centros Formación"
                isOpen={isOpen}
                activePaths={["/reports"]}
              />
              <SidebarButton
                to="/reports/inventario"
                label="Inventario"
                isOpen={isOpen}
                activePaths={["/reports/inventario"]}
              />
              <SidebarButton
                to="/reports/usuarios"
                label="Usuarios"
                isOpen={isOpen}
                activePaths={["/reports/usuarios"]}
              />

              {/* Submenú InfoReports */}
              <SidebarButton
                icon={<BarChart2 className="w-4 h-4" />}
                label="InfoReports"
                isOpen={isOpen}
                onClick={() => setShowInfoReportsSubmenu(!showInfoReportsSubmenu)}
                endIcon={
                  showInfoReportsSubmenu ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )
                }
              />

              {showInfoReportsSubmenu && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  <SidebarButton
                    to="/reportsInfo"
                    icon={<List className="w-4 h-4" />}
                    label="Reportes Centros"
                    isOpen={isOpen}
                    activePaths={["/reportsInfo"]}
                  />
                  <SidebarButton
                    to="/reportsInfo"
                    icon={<PieChart className="w-4 h-4" />}
                    label="Gráficos"
                    isOpen={isOpen}
                    activePaths={["/reportsInfo"]}
                  />
                </div>
              )}
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
