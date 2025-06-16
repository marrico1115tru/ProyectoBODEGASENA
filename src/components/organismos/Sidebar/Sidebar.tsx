import { useState } from "react";
import {
  Home, Menu, FileText, ChevronDown, ChevronUp, Users, BarChart2,
  List, Table, Warehouse, Building2, GraduationCap, FolderGit2,
  MapPin, BookOpen, ShieldCheck, LayoutGrid, KeySquare, ClipboardList,
  Send, Landmark, LogOut,
} from "lucide-react";
import SidebarButton from "@/components/molecula/Button";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({
    reports: false,
    products: false,
    infoReports: false,
    productReports: false,
    userReports: false,
    admin: false,
  });

  const navigate = useNavigate();

  const toggleMenu = (menu: keyof typeof openMenus) =>
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const handleLogout = () => {
    // Aquí puedes borrar token, limpiar estado o redirigir
    localStorage.clear();
    navigate("/login"); // Cambia a la ruta de login según tu sistema
  };

  return (
    <aside className={`transition-all duration-300 flex flex-col shadow-lg border-r border-slate-700 ${isOpen ? "w-64" : "w-20"} min-h-screen bg-slate-900 text-white`}>

      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        {isOpen && <h1 className="text-xl font-bold tracking-wide text-cyan-400">NATURVIDA</h1>}
        <Button
          variant="ghost"
          className="text-white hover:text-slate-200 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
        <nav className="flex flex-col gap-1 text-sm font-medium">
          <SidebarButton to="/" icon={<Home className="w-5 h-5" />} label="Home" isOpen={isOpen} activePaths={["/"]} />
          <SidebarButton to="/inicio" icon={<FileText className="w-5 h-5" />} label="Inicio" isOpen={isOpen} activePaths={["/inicio"]} />

          {/* Productos */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Productos"
            isOpen={isOpen}
            onClick={() => toggleMenu("products")}
            endIcon={openMenus.products ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {openMenus.products && isOpen && (
            <Submenu>
              <SidebarButton
                to="/productos/listar"
                icon={<Table className="w-4 h-4" />}
                label="Ver Productos"
                isOpen={isOpen}
                activePaths={["/productos/listar"]}
              />
            </Submenu>
          )}

          {/* Movimiento de inventario */}
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
            onClick={() => toggleMenu("reports")}
            endIcon={openMenus.reports ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {openMenus.reports && isOpen && (
            <Submenu>
              <SidebarButton to="/VistaProductos" label="Productos" isOpen={isOpen} activePaths={["/VistaProductos"]} />
              <SidebarButton to="/VistaEstadisticasUsuarios" label="Usuarios" isOpen={isOpen} activePaths={["/VistaEstadisticasUsuarios"]} />
              <SidebarButton to="/VistaEstadisticasSitios" label="Sitios" isOpen={isOpen} activePaths={["/VistaEstadisticasSitios"]} />
            </Submenu>
          )}

          {/* Reportes */}
          <SidebarButton
            icon={<FileText className="w-5 h-5" />}
            label="Reportes"
            isOpen={isOpen}
            onClick={() => toggleMenu("infoReports")}
            endIcon={openMenus.infoReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {openMenus.infoReports && isOpen && (
            <Submenu>
              {/* Submenu Productos */}
              <SidebarButton
                icon={<List className="w-4 h-4" />}
                label="Productos"
                isOpen={isOpen}
                onClick={() => toggleMenu("productReports")}
                endIcon={openMenus.productReports ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              />
              {openMenus.productReports && (
                <Submenu indent>
                  <SidebarButton to="/report/productosRep/ProductosPorArea" label="Productos por área" isOpen={isOpen} activePaths={["/report/productosRep/ProductosPorArea"]} />
                  <SidebarButton to="/report/productosRep/ProductosVencidos" label="Productos vencidos" isOpen={isOpen} activePaths={["/report/productosRep/ProductosVencidos"]} />
                  <SidebarButton to="/report/productosRep/ProductosVencimiento" label="Próximos a vencer" isOpen={isOpen} activePaths={["/report/productosRep/ProductosVencimiento"]} />
                </Submenu>
              )}

              {/* Submenu Usuarios */}
              <SidebarButton
                icon={<Users className="w-4 h-4" />}
                label="Usuarios"
                isOpen={isOpen}
                onClick={() => toggleMenu("userReports")}
                endIcon={openMenus.userReports ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              />
              {openMenus.userReports && (
                <Submenu indent>
                  <SidebarButton to="/report/UsuariosRep/UsuariosPorRol" label="Usuarios por rol" isOpen={isOpen} activePaths={["/report/UsuariosRep/UsuariosPorRol"]} />
                  <SidebarButton to="/report/UsuariosRep/UsuariosHistoria" label="Historial materiales utilizados" isOpen={isOpen} activePaths={["/report/UsuariosRep/UsuariosHistoria"]} />
                </Submenu>
              )}
            </Submenu>
          )}

          {/* Admin */}
          <SidebarButton
            icon={<ShieldCheck className="w-5 h-5" />}
            label="Admin"
            isOpen={isOpen}
            onClick={() => toggleMenu("admin")}
            endIcon={openMenus.admin ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          />
          {openMenus.admin && isOpen && (
            <Submenu>
              <SidebarButton to="/usuarios" icon={<Users className="w-4 h-4" />} label="Usuarios" isOpen={isOpen} activePaths={["/usuarios"]} />
              <SidebarButton to="/MunicipioPage" icon={<MapPin className="w-4 h-4" />} label="Municipios" isOpen={isOpen} activePaths={["/MunicipioPage"]} />
              <SidebarButton to="/CentrosFormaciones" icon={<Building2 className="w-4 h-4" />} label="Centros Formación" isOpen={isOpen} activePaths={["/CentrosFormaciones"]} />
              <SidebarButton to="/TituladosPage" icon={<GraduationCap className="w-4 h-4" />} label="Titulados" isOpen={isOpen} activePaths={["/TituladosPage"]} />
              <SidebarButton to="/AreasPage" icon={<FolderGit2 className="w-4 h-4" />} label="Áreas" isOpen={isOpen} activePaths={["/AreasPage"]} />
              <SidebarButton to="/SedesPage" icon={<Landmark className="w-4 h-4" />} label="Sedes" isOpen={isOpen} activePaths={["/SedesPage"]} />
              <SidebarButton to="/FichaFormacionPage" icon={<BookOpen className="w-4 h-4" />} label="Fichas Formación" isOpen={isOpen} activePaths={["/FichaFormacionPage"]} />
              <SidebarButton to="/RolesPage" icon={<ShieldCheck className="w-4 h-4" />} label="Roles" isOpen={isOpen} activePaths={["/RolesPage"]} />
              <SidebarButton to="/AccesosPage" icon={<KeySquare className="w-4 h-4" />} label="Accesos" isOpen={isOpen} activePaths={["/AccesosPage"]} />
              <SidebarButton to="/SolicitudesPage" icon={<ClipboardList className="w-4 h-4" />} label="Solicitudes" isOpen={isOpen} activePaths={["/SolicitudesPage"]} />
              <SidebarButton to="/EntregaMaterialPage" icon={<Send className="w-4 h-4" />} label="Entrega Materiales" isOpen={isOpen} activePaths={["/EntregaMaterialPage"]} />
              <SidebarButton to="/SitiosPage" icon={<MapPin className="w-4 h-4" />} label="Sitios" isOpen={isOpen} activePaths={["/SitiosPage"]} />
              <SidebarButton to="/Tipo_sitiosPage" icon={<MapPin className="w-4 h-4" />} label="Tipo de Sitios" isOpen={isOpen} activePaths={["/Tipo_sitiosPage"]} />
              <SidebarButton to="/CategoriasProductosPage" icon={<Send className="w-4 h-4" />} label="Categorias" isOpen={isOpen} activePaths={["/CategoriasProductosPage"]} />
              <SidebarButton to="/InventarioPage" icon={<MapPin className="w-4 h-4" />} label="Inventario" isOpen={isOpen} activePaths={["/InventarioPage"]} />
              <SidebarButton to="/DetalleSolicitudPage" icon={<MapPin className="w-4 h-4" />} label="Detalle solicitud" isOpen={isOpen} activePaths={["/DetalleSolicitudPage"]} />
            </Submenu>
          )}
        </nav>
      </div>

      {/* Botón de Cerrar Sesión */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 justify-start text-white hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Cerrar sesión</span>}
        </Button>
      </div>
    </aside>
  );
};

const Submenu = ({ children, indent = false }: { children: React.ReactNode; indent?: boolean }) => (
  <div className={`mt-1 flex flex-col gap-1 border-l border-slate-700 ${indent ? "ml-6 pl-4" : "ml-4 pl-3"}`}>
    {children}
  </div>
);

export default Sidebar;
