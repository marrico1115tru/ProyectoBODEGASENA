import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí podrías validar credenciales antes de redirigir
    navigate("/home");
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {/* Botón de Login */}
      <Button onClick={handleLogin}>Iniciar sesión</Button>
    </div>
  );
};

export default Login;
