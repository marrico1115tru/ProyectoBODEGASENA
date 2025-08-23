import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { User, Mail, ArrowLeft } from "lucide-react"; 
import { getPerfil } from "@/Api/auth/perfil";


interface UserProfile {
  id: number;
  nombre: string;
  email: string;
  rol: {
    id: number;
    nombre: string;
  };
}

export default function Perfil() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getPerfil();
        if (data && data.user) {
          setUser(data.user);
        } else {
          setError("No se pudo obtener la información del usuario.");
        }
      } catch (err) {
        setError("Error de autenticación o de conexión. Por favor, inicia sesión de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  
  if (loading) {
    return <DefaultLayout><div className="text-center p-10">Cargando perfil...</div></DefaultLayout>;
  }
  if (error) {
    return <DefaultLayout><div className="text-center text-red-500 font-bold p-10">{error}</div></DefaultLayout>;
  }
  if (!user) {
    return <DefaultLayout><div className="text-center p-10">No se encontraron datos del usuario.</div></DefaultLayout>;
  }


  return (
    <DefaultLayout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 md:p-10">
          
        
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=0f172a&color=fff&size=128`}
              alt="Avatar del usuario"
              className="w-28 h-28 rounded-full border-4 border-cyan-500 shadow-lg object-cover"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold text-slate-800 break-words">{user.nombre}</h1>
              <p className="text-slate-500 text-lg">Mi perfil</p>
            </div>
          </div>

          
          <div className="space-y-6">
            <Campo label="Correo electrónico" value={user.email} Icon={Mail} />
            <Campo label="Rol" value={user.rol.nombre} Icon={User} />
          </div>

          
          <div className="mt-10 flex justify-end">
            <Link 
              to="/Home" 
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition-transform transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </Link>
          </div>

        </div>
      </div>
    </DefaultLayout>
  );
}

function Campo({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center space-x-4">
      {Icon && <Icon className="w-6 h-6 text-cyan-600 flex-shrink-0" />}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">{label}</h2>
        <p className="text-lg text-slate-800 break-words">{value}</p>
      </div>
    </div>
  );
}