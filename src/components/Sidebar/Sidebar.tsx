import { useState } from "react";
import { Home, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

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
          <Button variant="ghost" className="flex items-center gap-2">
            <Home /> {isOpen && "Home"}
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Settings /> {isOpen && "Settings"}
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Card className="p-6">Main Content Area</Card>
      </main>
    </div>
  );
};

export default Sidebar;
