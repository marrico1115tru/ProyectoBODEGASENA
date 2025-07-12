import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEnvelope } from "react-icons/fa";
import { recuperarPassword } from "@/Api/auth/auth"; // 👈 IMPORTANTE

const RecuperarContraseña = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleRecuperar = async () => {
    setError("");
    setMensaje("");

    try {
      await recuperarPassword(email.trim()); // ✅ usando axios
      setMensaje(
        "📩 Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña."
      );
    } catch (err) {
      console.error("❌ Error al enviar recuperación:", err);
      setError("❌ Error al enviar el correo de recuperación");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-10 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Recuperar contraseña
        </h2>

        <label className="block mb-2 text-sm text-white/80">
          Correo electrónico
        </label>
        <div className="relative mb-4">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <FaEnvelope />
          </span>
          <Input
            type="email"
            placeholder="Ingrese su correo"
            className="pl-10 bg-slate-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {mensaje && <p className="text-green-500 text-sm mb-2">{mensaje}</p>}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Button
          onClick={handleRecuperar}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Enviar enlace
        </Button>
      </div>
    </div>
  );
};

export default RecuperarContraseña;
