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
import Proveedores from "./components/organismos/pages/productos/proveedores/proveedores";
import CentrosRep from "./components/organismos/pages/reportsInfo/centrosRep";
import BodegasRep from "./components/organismos/pages/reportsInfo/bodegasRep";
import Areas from "./components/organismos/pages/estadisticas/areas";
import CentrosFormacionView from "@/components/organismos/pages/views/CentrosFormacionView";
import BodegasView from "@/components/organismos/pages/estadisticas/bodegasView";
import EstadisticasAreas from "./components/organismos/pages/estadisticas/areas";
import AreasRepo from "./components/organismos/pages/reportsInfo/areasRepo";
import CategoriasEstadisticas from "./components/organismos/pages/estadisticas/CategoriasEstadisticas";
import ProductosTable from "./components/organismos/pages/productos/productosTable";
import UsersView from "./components/organismos/pages/Admin/usuarios/UsersView.tsx";
import Bodega from "./components/organismos/pages/Admin/bodegas/Bodega.tsx";
import CentrosFormaciones from "./components/organismos/pages/Admin/centrosformacion/CentrosFormacion.tsx";
import MovimientosTable from "./components/organismos/pages/Admin/entradas_salidas/MovimientosTable.tsx";

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
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="usuarios" element={<UsersView />} />
          <Route path="/productos/listar" element={<ProductosTable />} />
          <Route path="/centrosRep" element={<CentrosRep />} />
          <Route path="/bodegasRep" element={<BodegasRep />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/centrosFormacion" element={<CentrosFormacionView />} />
          <Route path="/bodegasView" element={<BodegasView />} />
          <Route path="/estadisticasAreas" element={<EstadisticasAreas />} />
          <Route path="/areasRep" element={<AreasRepo />} />
          <Route path="/categoriasEstadisticas" element={<CategoriasEstadisticas />} />
          <Route path="/Bodega" element={<Bodega/>}/>
          <Route path="/CentrosFormaciones" element={<CentrosFormaciones/>}/>
          <Route path="/MovimientosTable" element={<MovimientosTable/>}/>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
