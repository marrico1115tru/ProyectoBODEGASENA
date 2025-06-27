// src/components/LogoutButton.tsx
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "@/Api/auth/logout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");

  if (!token) return null; // 🔐 Oculta el botón si no hay sesión

  const handleLogout = () => {
    logout(); // ❌ Elimina token
    navigate("/login"); // 🔁 Redirige
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="flex gap-2 items-center"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton;
