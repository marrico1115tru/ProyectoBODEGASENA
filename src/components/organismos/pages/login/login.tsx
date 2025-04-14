
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    //validar credenciales antes de redirigir
    navigate("/Home");
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Button className= "login-button" onClick={handleLogin}>Iniciar</Button>
    </div>
  );
};

export default Login;

