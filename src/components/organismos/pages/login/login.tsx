import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Validación real de credenciales debería ir aquí
    navigate("/Home");
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('src/img/iniciosesion.jpeg')`, // Asegúrate de que la ruta sea válida
      }}
    >
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-10 rounded-xl shadow-2xl max-w-sm w-full text-gray-100">
        <div className="flex justify-center mb-6">
          <img src="src/img/log.png" alt="Logo" className="h-16" />
        </div>

        <h2 className="text-center text-2xl font-bold mb-6 text-white">INGRESAR</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Usuario</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <FaUser />
              </span>
              <Input
                placeholder="Ingrese su usuario"
                className="pl-10 bg-slate-800 text-white placeholder-white/60 border border-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/80">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <FaLock />
              </span>
              <Input
                type="password"
                placeholder="Ingrese su contraseña"
                className="pl-10 bg-slate-800 text-white placeholder-white/60 border border-slate-600"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
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
