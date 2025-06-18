import { useState } from "react";
import {
  Home, Menu, FileText, ChevronDown, ChevronUp, Users, BarChart2,
  Warehouse, Building2, GraduationCap, FolderGit2,
  MapPin, BookOpen, ShieldCheck, ClipboardList,
  Landmark, LogOut,
  Boxes,
  Tags,
  ListChecks,
  PackageCheck,
  ArrowLeftRight,
  FilePlus,
  PackageSearch,
  Users2,
  UserCog,
  History,
  LayoutGrid,
  AlertTriangle,
  Clock,
} from "lucide-react";
import SidebarButton from "@/components/molecula/Button";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({
    reports: false,
    products: false,
    solicitudes: false,
    infoReports: false,
    productReports: false,
    userReports: false,
    admin: false,
  });

  const navigate = useNavigate();

  const toggleMenu = (menu: keyof typeof openMenus) =>
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const handleLogout = () => {
    
    localStorage.clear();
    navigate("/login"); 
  };

  return (
    <aside className={`transition-all duration-300 flex flex-col shadow-lg border-r border-slate-700 ${isOpen ? "w-64" : "w-20"} min-h-screen bg-slate-900 text-white`}>

      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        {isOpen && <h1 className="text-xl font-bold tracking-wide text-cyan-400">INNOVASOFT</h1>}
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
  endIcon={
    openMenus.products ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }
/>
{openMenus.products && isOpen && (
  <Submenu>
    <SidebarButton
      to="/productos/listar"
      icon={<Boxes className="w-4 h-4" />} // 📦 ícono bonito para productos
      label="Ver Productos"
      isOpen={isOpen}
      activePaths={["/productos/listar"]}
    />
    <SidebarButton
      to="/CategoriasProductosPage"
      icon={<Tags className="w-4 h-4" />} // 🏷️ ícono para categorías
      label="Categorías"
      isOpen={isOpen}
      activePaths={["/CategoriasProductosPage"]}
    />
    <SidebarButton
      to="/InventarioPage"
      icon={<Warehouse className="w-4 h-4" />} // 🏬 ícono para inventario
      label="Inventario"
      isOpen={isOpen}
      activePaths={["/InventarioPage"]}
    />
  </Submenu>
)}

{/* Solicitudes */}
<SidebarButton
  icon={<ClipboardList className="w-5 h-5" />} // Icono principal para solicitudes
  label="Solicitudes"
  isOpen={isOpen}
  onClick={() => toggleMenu("solicitudes")}
  endIcon={
    openMenus.solicitudes ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }
/>
{openMenus.solicitudes && isOpen && (
  <Submenu>
    <SidebarButton
      to="/SolicitudesPage"
      icon={<FilePlus className="w-4 h-4" />} // 📝 para registrar solicitudes
      label="Solicitudes"
      isOpen={isOpen}
      activePaths={["/SolicitudesPage"]}
    />
    <SidebarButton
      to="/DetalleSolicitudPage"
      icon={<ListChecks className="w-4 h-4" />} // 📋 para ver detalle de la solicitud
      label="Detalle de la Solicitud"
      isOpen={isOpen}
      activePaths={["/DetalleSolicitudPage"]}
    />
    <SidebarButton
      to="/EntregaMaterialPage"
      icon={<PackageCheck className="w-4 h-4" />} // 📦 para entrega de materiales
      label="Entrega de Material"
      isOpen={isOpen}
      activePaths={["/EntregaMaterialPage"]}
    />
    <SidebarButton
      to="/MovimientoInventarioPage"
      icon={<ArrowLeftRight className="w-4 h-4" />} // 🔁 para movimientos
      label="Movimientos"
      isOpen={isOpen}
      activePaths={["/MovimientoInventarioPage"]}
    />
  </Submenu>
)}



          

         {/* Estadísticas */}
<SidebarButton
  icon={<BarChart2 className="w-5 h-5" />} // Icono principal de estadísticas
  label="Estadísticas"
  isOpen={isOpen}
  onClick={() => toggleMenu("reports")}
  endIcon={openMenus.reports ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
/>
{openMenus.reports && isOpen && (
  <Submenu>
    <SidebarButton
      to="/VistaProductos"
      icon={<PackageSearch className="w-4 h-4" />} // 📦 Icono para estadísticas de productos
      label="Productos"
      isOpen={isOpen}
      activePaths={["/VistaProductos"]}
    />
    <SidebarButton
      to="/VistaEstadisticasUsuarios"
      icon={<Users2 className="w-4 h-4" />} // 👥 Icono para usuarios
      label="Usuarios"
      isOpen={isOpen}
      activePaths={["/VistaEstadisticasUsuarios"]}
    />
    <SidebarButton
      to="/VistaEstadisticasSitios"
      icon={<MapPin className="w-4 h-4" />} // 🗺️ Icono para sitios
      label="Sitios"
      isOpen={isOpen}
      activePaths={["/VistaEstadisticasSitios"]}
    />
  </Submenu>
)}


         {/* Reportes */}
<SidebarButton
  icon={<FileText className="w-5 h-5" />} // Icono principal del menú Reportes
  label="Reportes"
  isOpen={isOpen}
  onClick={() => toggleMenu("infoReports")}
  endIcon={openMenus.infoReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
/>
{openMenus.infoReports && isOpen && (
  <Submenu>
    {/* Submenu Productos */}
    <SidebarButton
      icon={<PackageSearch className="w-4 h-4" />} // 📦 Icono para el grupo de productos
      label="Productos"
      isOpen={isOpen}
      onClick={() => toggleMenu("productReports")}
      endIcon={openMenus.productReports ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    />
    {openMenus.productReports && (
      <Submenu indent>
        <SidebarButton
          to="/report/productosRep/ProductosPorArea"
          icon={<LayoutGrid className="w-4 h-4" />} // 🗂️ Productos por área
          label="Productos por área"
          isOpen={isOpen}
          activePaths={["/report/productosRep/ProductosPorArea"]}
        />
        <SidebarButton
          to="/report/productosRep/ProductosVencidos"
          icon={<AlertTriangle className="w-4 h-4" />} // ⚠️ Productos vencidos
          label="Productos vencidos"
          isOpen={isOpen}
          activePaths={["/report/productosRep/ProductosVencidos"]}
        />
        <SidebarButton
          to="/report/productosRep/ProductosVencimiento"
          icon={<Clock className="w-4 h-4" />} // 🕒 Próximos a vencer
          label="Próximos a vencer"
          isOpen={isOpen}
          activePaths={["/report/productosRep/ProductosVencimiento"]}
        />
      </Submenu>
    )}

    {/* Submenu Usuarios */}
    <SidebarButton
      icon={<Users className="w-4 h-4" />} // 👥 Usuarios
      label="Usuarios"
      isOpen={isOpen}
      onClick={() => toggleMenu("userReports")}
      endIcon={openMenus.userReports ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    />
    {openMenus.userReports && (
      <Submenu indent>
        <SidebarButton
          to="/report/UsuariosRep/UsuariosPorRol"
          icon={<UserCog className="w-4 h-4" />} // 👤 Usuarios por rol
          label="Usuarios por rol"
          isOpen={isOpen}
          activePaths={["/report/UsuariosRep/UsuariosPorRol"]}
        />
        <SidebarButton
          to="/report/UsuariosRep/UsuariosHistoria"
          icon={<History className="w-4 h-4" />} // 🕘 Historial de materiales
          label="Historial materiales utilizados"
          isOpen={isOpen}
          activePaths={["/report/UsuariosRep/UsuariosHistoria"]}
        />
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
              <SidebarButton to="/SitiosPage" icon={<MapPin className="w-4 h-4" />} label="Sitios" isOpen={isOpen} activePaths={["/SitiosPage"]} />
              <SidebarButton to="/Tipo_sitiosPage" icon={<MapPin className="w-4 h-4" />} label="Tipo de Sitios" isOpen={isOpen} activePaths={["/Tipo_sitiosPage"]} />
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
