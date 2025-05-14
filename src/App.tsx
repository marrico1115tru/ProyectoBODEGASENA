import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, useLocation } from "react-router-dom";

import IndexPage from "@/components/organismos/pages/index";
import Sidebar from "./components/organismos/Sidebar/Sidebar";
import Login from "./components/organismos/pages/login/login";
import Inicio from "./components/organismos/pages/Inicio/inicio";
import Agropecuario from "./components/organismos/pages/Inicio/agropecuario";
import AmbientalView from "./components/organismos/pages/Inicio/ambiental";
import Gastronomia from "./components/organismos/pages/Inicio/gastronomia";
import EscuelaCafeView from "./components/organismos/pages/Inicio/EscuelaCafe";
import ViasView from "./components/organismos/pages/Inicio/vias";
import TicView from "./components/organismos/pages/Inicio/tic";
import ProductosTable from "./components/organismos/pages/productos/productosTable";
import UsersView from "./components/organismos/pages/Admin/usuarios/UsersView.tsx";
import Bodega from "./components/organismos/pages/Admin/bodegas/Bodega.tsx";
import CentrosFormaciones from "./components/organismos/pages/Admin/centrosformacion/CentrosFormacion.tsx";
import MovimientosTable from "./components/organismos/pages/Admin/entradas_salidas/MovimientosTable.tsx";
import VistaProductos from "./components/organismos/pages/estadisticas/VistaProductos.tsx"
import UsuariosHistoria from "./components/organismos/pages/Reportes/UsuariosRep/UsuariosHistorial.tsx"
import UsuariosPorRol from "./components/organismos/pages/Reportes/UsuariosRep/UsuariosPorRol.tsx";
import VistaEstadisticasUsuarios from "./components/organismos/pages/estadisticas/VistaEstadisticasUsuarios.tsx";
import ProductosPorArea from "./components/organismos/pages/Reportes/productosRep/ProductosPorArea.tsx";
import VistaEstadisticasSitios from "./components/organismos/pages/estadisticas/VistaEstadisticasSitios.tsx";
import ProductosVencidos from "./components/organismos/pages/Reportes/productosRep/ProductosVencidos.tsx";
import ProductosVencimiento from "./components/organismos/pages/Reportes/productosRep/ProductosVencimiento.tsx";
const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="flex">
      <QueryClientProvider client={queryClient}>
        {!isLogin && <Sidebar />}
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<IndexPage />} />
          <Route path="/agropecuario" element={<Agropecuario />} />
          <Route path="/ambiental" element={<AmbientalView />} />
          <Route path="/gastronomia" element={<Gastronomia />} />
          <Route path="/vias" element={<ViasView />} />
          <Route path="/tic" element={<TicView />} />
          <Route path="/escuelacafe" element={<EscuelaCafeView />} />
          <Route path="usuarios" element={<UsersView />} />
          <Route path="/productos/listar" element={<ProductosTable />} />
          <Route path="/Bodega" element={<Bodega/>}/>
          <Route path="/CentrosFormaciones" element={<CentrosFormaciones/>}/>
          <Route path="/MovimientosTable" element={<MovimientosTable/>}/>
          <Route path="/VistaProductos" element={<VistaProductos/>}/>    
          <Route path="/VistaEstadisticasUsuarios" element={<VistaEstadisticasUsuarios/>}/>
          <Route path="/VistaEstadisticasSitios" element={<VistaEstadisticasSitios/>}/>   
          <Route path="/report/productosRepo/ProductosPorArea" element={<ProductosPorArea />} />
          <Route path="report/productosRep/ProductosVencidos" element={<ProductosVencidos />} />
          <Route path="/report/productorRep/ProductosVencimiento" element={<ProductosVencimiento />} />
          <Route path="/report/UsuariosRep/UsuariosHistoria" element={<UsuariosHistoria />} />
          <Route path="/report/UsuariosRep/UsuariosPorRol" element={<UsuariosPorRol />} />




         

        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
