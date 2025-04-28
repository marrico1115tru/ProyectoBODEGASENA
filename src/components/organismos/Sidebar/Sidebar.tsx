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
  ClipboardList,
  ShoppingCart,
  Archive,
  Table,
  Warehouse,
} from "lucide-react"; // IMPORTANTE: Agregado el icono Warehouse
import SidebarButton from "@/components/molecula/Button";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showInfoReportsSubmenu, setShowInfoReportsSubmenu] = useState(false);
  const [showAdminSubmenu, setShowAdminSubmenu] = useState(false);

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } min-h-screen bg-slate-800 text-slate-100 transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* Botón para colapsar */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="text-slate-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Contenedor con scroll */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        <nav className="flex flex-col gap-2 text-sm font-medium">
          
          {/* Home */}
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

          {/* Productos */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Productos"
            isOpen={isOpen}
            onClick={() => setShowProductsSubmenu(!showProductsSubmenu)}
            endIcon={showProductsSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {showProductsSubmenu && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <SidebarButton
                to="/productos/listar"
                icon={<Table className="w-4 h-4" />}
                label="Ver Productos"
                isOpen={isOpen}
                activePaths={["/productos/listar"]}
              />
              <SidebarButton
                to="/categorias"
                icon={<PackagePlus className="w-4 h-4" />}
                label="Categorias"
                isOpen={isOpen}
                activePaths={["/categorias"]}
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
                label="Vencimiento"
                isOpen={isOpen}
                activePaths={["/vencimiento"]}
              />
            </div>
          )}

          {/* Entradas y Salidas */}
          <SidebarButton
            to="/MovimientosTable"
            icon={<Warehouse className="w-5 h-5" />}
            label="Entradas y Salidas"
            isOpen={isOpen}
            activePaths={["/MovimientosTable"]}
          />

          {/* Estadísticas */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Estadísticas"
            isOpen={isOpen}
            onClick={() => setShowReports(!showReports)}
            endIcon={showReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {showReports && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <SidebarButton
                to="/centrosFormacion"
                label="Centros Formación"
                isOpen={isOpen}
                activePaths={["/centrosFormacion"]}
              />
              <SidebarButton
                to="/bodegasView"
                label="Bodegas"
                isOpen={isOpen}
                activePaths={["/bodegasView"]}
              />
              <SidebarButton
                to="/estadisticasAreas"
                label="Areas"
                isOpen={isOpen}
                activePaths={["/estadisticasAreas"]}
              />
              <SidebarButton
                to="/categoriasEstadisticas"
                label="Categorias"
                isOpen={isOpen}
                activePaths={["/categoriasEstadisticas"]}
              />
              <SidebarButton
                to="/reports/pedidos"
                icon={<ShoppingCart className="w-4 h-4" />}
                label="Pedidos"
                isOpen={isOpen}
                activePaths={["/reports/pedidos"]}
              />
            </div>
          )}

          {/* InfoReports */}
          <SidebarButton
            icon={<BarChart2 className="w-5 h-5" />}
            label="InfoReports"
            isOpen={isOpen}
            onClick={() => setShowInfoReportsSubmenu(!showInfoReportsSubmenu)}
            endIcon={showInfoReportsSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {showInfoReportsSubmenu && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <SidebarButton
                to="/centrosRep"
                icon={<List className="w-4 h-4" />}
                label="Reportes Centros"
                isOpen={isOpen}
                activePaths={["/centrosRep"]}
              />
              <SidebarButton
                to="/bodegasRep"
                icon={<PieChart className="w-4 h-4" />}
                label="Reportes Bodegas"
                isOpen={isOpen}
                activePaths={["/bodegasRep"]}
              />
              <SidebarButton
                to="/areasRep"
                icon={<ClipboardList className="w-4 h-4" />}
                label="Reportes Areas"
                isOpen={isOpen}
                activePaths={["/areasRep"]}
              />
              <SidebarButton
                to="/reportesStock"
                icon={<Archive className="w-4 h-4" />}
                label="Stock General"
                isOpen={isOpen}
                activePaths={["/reportesStock"]}
              />
            </div>
          )}

          {/* Admin */}
          <SidebarButton
            icon={<Users className="w-5 h-5" />}
            label="Admin"
            isOpen={isOpen}
            onClick={() => setShowAdminSubmenu(!showAdminSubmenu)}
            endIcon={showAdminSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {showAdminSubmenu && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <SidebarButton
                to="/usuarios"
                icon={<Users className="w-4 h-4" />}
                label="Usuarios"
                isOpen={isOpen}
                activePaths={["/usuarios"]}
              />
              <SidebarButton
                to="/Bodega"
                icon={<Users className="w-4 h-4" />}
                label="Bodegas"
                isOpen={isOpen}
                activePaths={["/Bodega"]}
              />
              <SidebarButton
                to="/CentrosFormaciones"
                icon={<Users className="w-4 h-4" />}
                label="Centros Formacion"
                isOpen={isOpen}
                activePaths={["/CentrosFormaciones"]}
              />
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
