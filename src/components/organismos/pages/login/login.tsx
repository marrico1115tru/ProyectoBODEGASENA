import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí deberías validar credenciales reales
    navigate("/Home");
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('src/img/iniciosesion.jpeg')`, // cambia a la imagen que desees
      }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-xl shadow-lg max-w-sm w-full text-white">
        <div className="flex justify-center mb-6">
          <img src="src/img/log.png" alt="Logo" className="h-16" />
        </div>
        <h2 className="text-center text-2xl font-semibold mb-6">INGRESAR</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Usuario</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <FaUser />
              </span>
              <Input
                placeholder="Ingrese su usuario"
                className="pl-10 bg-white/20 text-white placeholder-white/70 border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <FaLock />
              </span>
              <Input
                type="password"
                placeholder="Ingrese su contraseña"
                className="pl-10 bg-white/20 text-white placeholder-white/70 border-white/30"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold"
          >
            Iniciar
          </Button>
        </div>

        <p className="text-center text-xs text-white/70 mt-4 hover:underline cursor-pointer">
          ¿Olvidó su contraseña?
        </p>
      </div>
    </div>
  );
};

export default Login;
