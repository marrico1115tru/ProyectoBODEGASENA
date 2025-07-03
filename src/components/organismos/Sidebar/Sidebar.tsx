import { useEffect, useState } from "react";
import {
  Home, Menu, FileText, ChevronDown, ChevronUp, Users, BarChart2,
  Warehouse, Building2, GraduationCap, FolderGit2, MapPin, BookOpen,
  ShieldCheck, ClipboardList, Landmark, LogOut, Boxes, Tags, ListChecks,
  PackageCheck, ArrowLeftRight, FilePlus, PackageSearch, Users2, LayoutGrid,
  AlertTriangle, Clock, UserCog, History
} from "lucide-react";
import SidebarButton from "@/components/molecula/Button";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getDecodedTokenFromCookies } from "@/lib/utils";
import axios from "axios";

const normalizar = (str: string) => str.toLowerCase().replace(/\s+/g, "");

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modulosPermitidos, setModulosPermitidos] = useState<string[]>([]);
  const [openMenus, setOpenMenus] = useState({
    reports: false,
    products: false,
    solicitudes: false,
    admin: false,
    ubicacion: false,
    formacion: false,
    infoReports: false,
    productReports: false,
    userReports: false
  });

  const navigate = useNavigate();
  const toggleMenu = (menu: keyof typeof openMenus) =>
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchModulos = async () => {
      try {
        const userData = getDecodedTokenFromCookies("token");
        const rolId = userData?.rol?.id;
        if (!rolId) return;

        const url = `http://localhost:3000/permisos/modulos/${rolId}`;
        const response = await axios.get(url, { withCredentials: true });

        if (Array.isArray(response.data)) {
          const nombres = response.data.map((m: any) => normalizar(m.nombremodulo));
          setModulosPermitidos(nombres);
        }
      } catch (err) {
        setError("Error al obtener permisos de módulos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModulos();
  }, []);

  return (
    <aside className={`transition-all duration-300 flex flex-col shadow-lg border-r border-slate-700 ${isOpen ? "w-64" : "w-20"} min-h-screen bg-slate-900 text-white`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        {isOpen && <h1 className="text-xl font-bold tracking-wide text-cyan-400">INNOVASOFT</h1>}
        <Button variant="ghost" className="text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
        {loading ? (
          <p className="text-center text-gray-400">Cargando permisos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {/* Siempre visibles */}
            <SidebarButton to="/home" icon={<Home />} label="Home" isOpen={isOpen} activePaths={["/home"]} />
            {modulosPermitidos.length > 1 && (
              <SidebarButton to="/InicioDash" icon={<FileText />} label="Inicio" isOpen={isOpen} activePaths={["/InicioDash"]} />
            )}

            {/* Módulos con permisos */}
            {modulosPermitidos.includes("productos") && (
              <>
                <SidebarButton icon={<FileText />} label="Productos" isOpen={isOpen} onClick={() => toggleMenu("products")} endIcon={openMenus.products ? <ChevronUp /> : <ChevronDown />} />
                {openMenus.products && isOpen && (
                  <Submenu>
                    <SidebarButton to="/productos/listar" icon={<Boxes />} label="Ver Productos" isOpen={isOpen} />
                    <SidebarButton to="/CategoriasProductosPage" icon={<Tags />} label="Categorías" isOpen={isOpen} />
                    <SidebarButton to="/InventarioPage" icon={<Warehouse />} label="Inventario" isOpen={isOpen} />
                  </Submenu>
                )}
              </>
            )}

            {modulosPermitidos.includes("solicitudes") && (
              <>
                <SidebarButton icon={<ClipboardList />} label="Solicitudes" isOpen={isOpen} onClick={() => toggleMenu("solicitudes")} endIcon={openMenus.solicitudes ? <ChevronUp /> : <ChevronDown />} />
                {openMenus.solicitudes && isOpen && (
                  <Submenu>
                    <SidebarButton to="/SolicitudesPage" icon={<FilePlus />} label="Solicitudes" isOpen={isOpen} />
                    <SidebarButton to="/DetalleSolicitudPage" icon={<ListChecks />} label="Detalle de la Solicitud" isOpen={isOpen} />
                    <SidebarButton to="/EntregaMaterialPage" icon={<PackageCheck />} label="Entrega de Material" isOpen={isOpen} />
                    <SidebarButton to="/MovimientoInventarioPage" icon={<ArrowLeftRight />} label="Movimientos" isOpen={isOpen} />
                  </Submenu>
                )}
              </>
            )}

            {modulosPermitidos.includes("estadisticas") && (
              <>
                <SidebarButton icon={<BarChart2 />} label="Estadísticas" isOpen={isOpen} onClick={() => toggleMenu("reports")} endIcon={openMenus.reports ? <ChevronUp /> : <ChevronDown />} />
                {openMenus.reports && isOpen && (
                  <Submenu>
                    <SidebarButton to="/VistaProductos" icon={<PackageSearch />} label="Productos" isOpen={isOpen} />
                    <SidebarButton to="/VistaEstadisticasUsuarios" icon={<Users2 />} label="Usuarios" isOpen={isOpen} />
                    <SidebarButton to="/VistaEstadisticasSitios" icon={<MapPin />} label="Sitios" isOpen={isOpen} />
                  </Submenu>
                )}

                <SidebarButton icon={<FileText />} label="Reportes" isOpen={isOpen} onClick={() => toggleMenu("infoReports")} endIcon={openMenus.infoReports ? <ChevronUp /> : <ChevronDown />} />
                {openMenus.infoReports && isOpen && (
                  <Submenu>
                    <SidebarButton icon={<PackageSearch />} label="Productos" isOpen={isOpen} onClick={() => toggleMenu("productReports")} endIcon={openMenus.productReports ? <ChevronUp /> : <ChevronDown />} />
                    {openMenus.productReports && (
                      <Submenu indent>
                        <SidebarButton to="/report/productosRep/ProductosPorSitio" icon={<LayoutGrid />} label="Productos por Sitio" isOpen={isOpen} />
                        <SidebarButton to="/report/productosRep/ProductosVencidos" icon={<AlertTriangle />} label="Productos vencidos" isOpen={isOpen} />
                        <SidebarButton to="/report/productosRep/ProductosVencimiento" icon={<Clock />} label="Próximos a vencer" isOpen={isOpen} />
                      </Submenu>
                    )}

                    <SidebarButton icon={<Users />} label="Usuarios" isOpen={isOpen} onClick={() => toggleMenu("userReports")} endIcon={openMenus.userReports ? <ChevronUp /> : <ChevronDown />} />
                    {openMenus.userReports && (
                      <Submenu indent>
                        <SidebarButton to="/report/UsuariosRep/UsuariosPorRol" icon={<UserCog />} label="Usuarios por rol" isOpen={isOpen} />
                        <SidebarButton to="/report/UsuariosRep/UsuariosHistoria" icon={<History />} label="Historial materiales utilizados" isOpen={isOpen} />
                      </Submenu>
                    )}
                  </Submenu>
                )}
              </>
            )}

            {modulosPermitidos.includes("administracion") && (
              <>
                <SidebarButton icon={<ShieldCheck />} label="Admin" isOpen={isOpen} onClick={() => toggleMenu("admin")} endIcon={openMenus.admin ? <ChevronUp /> : <ChevronDown />} />
                {openMenus.admin && isOpen && (
                  <Submenu>
                    <SidebarButton to="/usuarios" icon={<Users />} label="Usuarios" isOpen={isOpen} />
                    <SidebarButton to="/RolesPage" icon={<ShieldCheck />} label="Roles" isOpen={isOpen} />
                     <SidebarButton to="/getModulosConOpciones" icon={<ShieldCheck />} label="Dar Permisos" isOpen={isOpen} />
                  </Submenu>
                )}
              </>
            )}

            {modulosPermitidos.includes("ubicacion") && (
              <>
                <SidebarButton icon={<MapPin />} label="Ubicación" isOpen={isOpen} onClick={() => toggleMenu("ubicacion")} endIcon={openMenus.ubicacion ? <ChevronUp /> : <ChevronDown />} />
                {openMenus.ubicacion && isOpen && (
                  <Submenu>
                    <SidebarButton to="/MunicipioPage" icon={<MapPin />} label="Municipios" isOpen={isOpen} />
                    <SidebarButton to="/SedesPage" icon={<Landmark />} label="Sedes" isOpen={isOpen} />
                    <SidebarButton to="/SitiosPage" icon={<MapPin />} label="Sitios" isOpen={isOpen} />
                    <SidebarButton to="/Tipo_sitiosPage" icon={<MapPin />} label="Tipo de Sitios" isOpen={isOpen} />
                  </Submenu>
                )}
              </>
            )}

            {modulosPermitidos.includes("formacion") && (
              <>
                <SidebarButton icon={<GraduationCap />} label="Formación" isOpen={isOpen} onClick={() => toggleMenu("formacion")} endIcon={openMenus.formacion ? <ChevronUp /> : <ChevronDown />} />
                {openMenus.formacion && isOpen && (
                  <Submenu>
                    <SidebarButton to="/CentrosFormaciones" icon={<Building2 />} label="Centros Formación" isOpen={isOpen} />
                    <SidebarButton to="/TituladosPage" icon={<GraduationCap />} label="Titulados" isOpen={isOpen} />
                    <SidebarButton to="/FichaFormacionPage" icon={<BookOpen />} label="Fichas Formación" isOpen={isOpen} />
                    <SidebarButton to="/AreasPage" icon={<FolderGit2 />} label="Áreas" isOpen={isOpen} />
                  </Submenu>
                )}
              </>
            )}

            {modulosPermitidos.length === 0 && (
              <div className="text-center text-yellow-400 mt-4 text-xs">
                No tienes acceso a módulos adicionales.
              </div>
            )}
          </nav>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <Button variant="ghost" className="w-full flex items-center gap-2 justify-start text-white hover:bg-slate-800" onClick={handleLogout}>
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
