import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import IndexPage from "@/pages/index";
import Sidebar from "./components/Sidebar/Sidebar";
import Estadistica from "./pages/estadisticas/estadisticas";
import Login from "./pages/login/login";
import Products from "./pages/products/products";
import Inicio from "./pages/Inicio/inicio";
import CategoriesView from "./pages/categoriaspro/categoriaspro";
import Agropecuario from "./pages/agropecuario/agropecuario";
import AmbientalView from "./pages/ambiental/ambiental";
import Gastronomia from "./pages/gastronomia/gastronomia";
import EscuelaCafeView from "./pages/EscuelaCafe/EscuelaCafe";
import ViasView from "./pages/vias/vias";
import TicView from "./pages/tic/tic";
import CategoriasProductos from "./pages/categoriasProductos/categoriasProductos";
import Proveedores from "./pages/proveedores/proveedores";
import Vencimiento from "./pages/vencimiento/vencimiento";
import ReportsInfo from "./pages/reportsInfo/reportsInfo";


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
