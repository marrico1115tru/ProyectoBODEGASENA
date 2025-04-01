import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Sidebar from "./components/Sidebar/Sidebar";
import Reports from "./pages/reports";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
       <Route element={<IndexPage />} path="/" />
       <Route path="/reports" element={<Reports />} />
     </Routes>
    </div>
  );
}

export default App;
