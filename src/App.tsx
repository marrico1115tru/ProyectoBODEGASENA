import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import IndexPage from "@/components/organismos/pages/index";
import Sidebar from "./components/organismos/Sidebar/Sidebar";
import Estadistica from "./components/organismos/pages/estadisticas/estadisticas";
import Login from "./components/organismos/pages/login/login";
import Inicio from "./components/organismos/pages/Inicio/inicio";
import Agropecuario from "./components/organismos/pages/Inicio/agropecuario";
import AmbientalView from "./components/organismos/pages/Inicio/ambiental";
import Gastronomia from "./components/organismos/pages/Inicio/gastronomia";
import EscuelaCafeView from "./components/organismos/pages/Inicio/EscuelaCafe";
import ViasView from "./components/organismos/pages/Inicio/vias";
import TicView from "./components/organismos/pages/Inicio/tic";
import Proveedores from "./components/organismos/pages/productos/proveedores/proveedores";
import Vencimiento from "./components/organismos/pages/productos/vencimiento/vencimiento";
import ReportsInfo from "./components/organismos/pages/reportsInfo/reportsInfo";
import Categorias from "./components/organismos/pages/productos/categorias/categorias";
import CategoriasView from "@/components/organismos/pages/productos/categorias/CategoriasView";
import ProductosPorCategoria from "@/components/organismos/pages/productos/categorias/ProductosPorCategoria";

import { Route, Routes, useLocation } from "react-router-dom";

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
          <Route path="/estadisticas" element={<Estadistica />} />
          <Route path="/agropecuario" element={<Agropecuario />} />
          <Route path="/ambiental" element={<AmbientalView />} />
          <Route path="/gastronomia" element={<Gastronomia />} />
          <Route path="/vias" element={<ViasView />} />
          <Route path="/tic" element={<TicView />} />
          <Route path="/escuelacafe" element={<EscuelaCafeView />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/vencimiento" element={<Vencimiento />} />
          <Route path="/reportsInfo" element={<ReportsInfo />} />
          <Route path="/categorias" element={<Categorias />} />

          {/* 🆕 Agrega estas rutas nuevas */}
          <Route path="/categorias-view" element={<CategoriasView />} />
          <Route path="/categoria/:categoria" element={<ProductosPorCategoria />} />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
