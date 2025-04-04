import { Route, Routes, useLocation } from "react-router-dom";

import IndexPage from "@/pages/index";
import Sidebar from "./components/Sidebar/Sidebar";
import Reports from "./pages/reports/reports";
import Login from "./pages/login/login";
import Products from "./pages/products/products";
import Inicio from "./pages/Inicio/inicio";

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="flex">
      {!isLogin && <Sidebar />}
      <Routes>
        <Route path="/presentacion" element={<Inicio />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<IndexPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  );
}

export default App;
