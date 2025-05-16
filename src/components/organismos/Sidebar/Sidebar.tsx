import { useState } from "react";
import {
  Home,
  Menu,
  FileText,
  ChevronDown,
  ChevronUp,
  Users,
  BarChart2,
  List,
  Table,
  Warehouse,
} from "lucide-react";
import SidebarButton from "@/components/molecula/Button";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showInfoReportsSubmenu, setShowInfoReportsSubmenu] = useState(false);
  const [showAdminSubmenu, setShowAdminSubmenu] = useState(false);
  const [showProductReportsSubmenu, setShowProductReportsSubmenu] = useState(false);
  const [showUserReportsSubmenu, setShowUserReportsSubmenu] = useState(false);

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } min-h-screen bg-[#1e293b] text-[#f8fafc] transition-all duration-300 flex flex-col shadow-xl border-r border-[#334155]`}
    >
      {/* Header Branding */}
      <div className="flex items-center justify-between p-4 border-b border-[#334155]">
        {isOpen && (
          <h1 className="text-xl font-bold tracking-wide text-[#22d3ee] transition-colors duration-200">
            NATURVIDA
          </h1>
        )}
        <Button
          variant="ghost"
          className="text-white hover:text-[#22d3ee] p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
        <nav className="flex flex-col gap-1 text-sm font-medium">
          <SidebarButton to="/" icon={<Home className="w-5 h-5" />} label="Home" isOpen={isOpen} activePaths={["/"]} />
          <SidebarButton to="/inicio" icon={<FileText className="w-5 h-5" />} label="Inicio" isOpen={isOpen} activePaths={["/inicio"]} />

          {/* Productos */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Productos"
            isOpen={isOpen}
            onClick={() => setShowProductsSubmenu(!showProductsSubmenu)}
            endIcon={showProductsSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {showProductsSubmenu && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-[#334155] pl-3">
              <SidebarButton
                to="/productos/listar"
                icon={<Table className="w-4 h-4" />}
                label="Ver Productos"
                isOpen={isOpen}
                activePaths={["/productos/listar"]}
              />
            </div>
          )}

          {/* Entradas y Salidas */}
          <SidebarButton
            to="/MovimientoInventarioPage"
            icon={<Warehouse className="w-5 h-5" />}
            label="Entradas y Salidas"
            isOpen={isOpen}
            activePaths={["/MovimientoInventarioPage"]}
          />

          {/* Estadísticas */}
          <SidebarButton
            icon={<BarChart2 className="w-5 h-5" />}
            label="Estadísticas"
            isOpen={isOpen}
            onClick={() => setShowReports(!showReports)}
            endIcon={showReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {showReports && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-[#334155] pl-3">
              <SidebarButton to="/VistaProductos" label="Productos" isOpen={isOpen} activePaths={["/VistaProductos"]} />
              <SidebarButton to="/VistaEstadisticasUsuarios" label="Usuarios" isOpen={isOpen} activePaths={["/VistaEstadisticasUsuarios"]} />
              <SidebarButton to="/VistaEstadisticasSitios" label="Sitios" isOpen={isOpen} activePaths={["/VistaEstadisticasSitios"]} />
            </div>
          )}

          {/* Reportes */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Reportes"
            isOpen={isOpen}
            onClick={() => setShowInfoReportsSubmenu(!showInfoReportsSubmenu)}
            endIcon={showInfoReportsSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {showInfoReportsSubmenu && isOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-[#334155] pl-3">
              {/* Reportes de Productos */}
              <SidebarButton
                icon={<List className="w-4 h-4" />}
                label="Productos"
                isOpen={isOpen}
                onClick={() => setShowProductReportsSubmenu(!showProductReportsSubmenu)}
                endIcon={showProductReportsSubmenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              />
              {showProductReportsSubmenu && (
                <div className="ml-4 flex flex-col gap-1">
                  <SidebarButton
                    to="/report/productosRepo/ProductosPorArea"
                    label="Productos por área"
                    isOpen={isOpen}
                    activePaths={["/report/productosRepo/ProductosPorArea"]}
                  />
                  <SidebarButton
                    to="/report/productosRep/ProductosVencidos"
                    label="Productos vencidos"
                    isOpen={isOpen}
                    activePaths={["/report/productosRep/ProductosVencidos"]}
                  />
                  <SidebarButton
                    to="/report/productorRep/ProductosVencimiento"
                    label="Próximos a vencer"
                    isOpen={isOpen}
                    activePaths={["/report/productorRep/ProductosVencimiento"]}
                  />
                </div>
              )}

              {/* Reportes de Usuarios */}
              <SidebarButton
                icon={<Users className="w-4 h-4" />}
                label="Usuarios"
                isOpen={isOpen}
                onClick={() => setShowUserReportsSubmenu(!showUserReportsSubmenu)}
                endIcon={showUserReportsSubmenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              />
              {showUserReportsSubmenu && (
                <div className="ml-4 flex flex-col gap-1">
                  <SidebarButton
                    to="/report/UsuariosRep/UsuariosPorRol"
                    label="Usuarios Por rol"
                    isOpen={isOpen}
                    activePaths={["/report/UsuariosRep/UsuariosPorRol"]}
                  />
                  <SidebarButton
                    to="/report/UsuariosRep/UsuariosHistoria"
                    label="Historial materiales utilizados"
                    isOpen={isOpen}
                    activePaths={["/report/UsuariosRep/UsuariosHistoria"]}
                  />
                </div>
              )}
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
            <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-[#334155] pl-3">
              <SidebarButton to="/usuarios" icon={<Users className="w-4 h-4" />} label="Usuarios" isOpen={isOpen} activePaths={["/usuarios"]} />
              <SidebarButton to="/MunicipioPage" icon={<Users className="w-4 h-4" />} label="Municipios" isOpen={isOpen} activePaths={["/MunicipioPage"]} />
              <SidebarButton to="/CentrosFormaciones" icon={<Users className="w-4 h-4" />} label="Centros Formación" isOpen={isOpen} activePaths={["/CentrosFormaciones"]} />
              <SidebarButton to="/TituladosPage" icon={<Users className="w-4 h-4" />} label="Titulados" isOpen={isOpen} activePaths={["/TituladosPage"]} />
              <SidebarButton to="/AreasPage" icon={<Users className="w-4 h-4" />} label="Areas" isOpen={isOpen} activePaths={["/AreasPage"]} />
              <SidebarButton to="/SedesPage" icon={<Users className="w-4 h-4" />} label="sedes" isOpen={isOpen} activePaths={["/SedesPage"]} />
              <SidebarButton to="/FichaFormacionPage" icon={<Users className="w-4 h-4" />} label="Fichas Formacion" isOpen={isOpen} activePaths={["/FichaFormacionPage"]} />
              <SidebarButton to="/RolesPage" icon={<Users className="w-4 h-4" />} label="roles" isOpen={isOpen} activePaths={["/RolesPage"]} />
              <SidebarButton to="/OpcionPage" icon={<Users className="w-4 h-4" />} label="opciones" isOpen={isOpen} activePaths={["/OpcionPage"]} />
              <SidebarButton to="/AccesosPage" icon={<Users className="w-4 h-4" />} label="Accesos" isOpen={isOpen} activePaths={["/AccesosPage"]} />
              <SidebarButton to="/SolicitudesPage" icon={<Users className="w-4 h-4" />} label="Solicitudes" isOpen={isOpen} activePaths={["/SolicitudesPage"]} />
              <SidebarButton to="/EntregaMaterialPage" icon={<Users className="w-4 h-4" />} label="Entrega" isOpen={isOpen} activePaths={["/EntregaMaterialPage"]} />
              <SidebarButton to="/RolesPage" icon={<Users className="w-4 h-4" />} label="Sitios" isOpen={isOpen} activePaths={["/RolesPage"]} />
        
            </div>
          )}
        </nav>
      </div>

      {/* Footer opcional */}
      <div className="p-4 border-t border-[#334155] text-xs text-center text-[#94a3b8]">
        {isOpen && <span>INNOVASOFT</span>}
      </div>
    </aside>
  );
};

export default Sidebar;
