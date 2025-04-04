import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Sidebar from "./components/Sidebar/Sidebar";
import Reports from "./pages/reports/reports";
import Login from "./pages/login/login";
import Products from "./pages/products/products";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  );
}

export default App;
