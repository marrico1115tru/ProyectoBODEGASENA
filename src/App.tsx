import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import IndexPage from "@/components/organismos/pages/index";
import Sidebar from "./components/organismos/Sidebar/Sidebar";
import Estadistica from "./components/organismos/pages/estadisticas/estadisticas";
import Login from "./components/organismos/pages/login/login";
import Products from "./components/organismos/pages/products/products";
import Inicio from "./components/organismos/pages/Inicio/inicio";
import CategoriesView from "./components/organismos/pages/categoriaspro/categoriaspro";
import Agropecuario from "./components/organismos/pages/Inicio/agropecuario";
import AmbientalView from "./components/organismos/pages/Inicio/ambiental";
import Gastronomia from "./components/organismos/pages/Inicio/gastronomia";
import EscuelaCafeView from "./components/organismos/pages/Inicio/EscuelaCafe";
import ViasView from "./components/organismos/pages/Inicio/vias";
import TicView from "./components/organismos/pages/Inicio/tic";
import CategoriasProductos from "./components/organismos/pages/categoriasProductos/categoriasProductos";
import Proveedores from "./components/organismos/pages/proveedores/proveedores";
import Vencimiento from "./components/organismos/pages/vencimiento/vencimiento";
import ReportsInfo from "./components/organismos/pages/reportsInfo/reportsInfo";


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
        <Route path="/products" element={<Products />} />
        <Route path="/categoriaspro" element={<CategoriesView />} />
        <Route path="/agropecuario" element={<Agropecuario />} />
        <Route path="/ambiental" element={<AmbientalView />} />
        <Route path="/gastronomia" element={<Gastronomia />} />
        <Route path="/vias" element={<ViasView />} />
        <Route path="/tic" element={<TicView />} />
        <Route path="/escuelacafe" element={<EscuelaCafeView />} />
        <Route path="/categoriasProductos" element={<CategoriasProductos />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/vencimiento" element={<Vencimiento />} />
        <Route path= "/reportsInfo" element={<ReportsInfo/>} />
      </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
