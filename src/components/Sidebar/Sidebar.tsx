import { useState } from "react";
import { Home, Settings, Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex">
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } h-screen bg-gray-900 text-white transition-all duration-300 p-4 flex flex-col`}
      >
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
        <nav className="flex flex-col gap-4">
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/")}> 
            <Home /> {isOpen && "Home"}
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/settings")}> 
            <Settings /> {isOpen && "Settings"}
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/reports")}> 
            <FileText /> {isOpen && "Reportes"}
          </Button>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
