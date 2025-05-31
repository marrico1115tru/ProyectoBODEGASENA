import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Pencil, Upload } from "lucide-react";

export default function Perfil() {
  const [nombre, setNombre] = useState("Maria Rico");
  const [rol, setRol] = useState("Administrador");
  const [correo, setCorreo] = useState("maria.rico@example.com");
  const [telefono, setTelefono] = useState("+57 300 123 4567");
  const [centro, setCentro] = useState("SENA CBA");
  const [foto, setFoto] = useState<string | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFoto(url);
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative group">
              <img
                src={
                  foto || "https://ui-avatars.com/api/?name=Maria+Rico&background=0f172a&color=fff&size=128"
                }
                alt="Avatar"
                className="w-28 h-28 rounded-full border-4 border-cyan-500 shadow-lg object-cover"
              />
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <Upload className="text-white w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagen}
                />
              </label>
            </div>
            <div>
              {modoEdicion ? (
                <input
                  className="text-4xl font-bold text-slate-800 mb-1 border-b-2 border-cyan-400 outline-none bg-transparent"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-slate-800 mb-1">{nombre}</h1>
                  <p className="text-slate-500 text-lg">Desarrolladora Frontend</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Campo label="Correo electrónico" value={correo} onChange={setCorreo} edit={modoEdicion} />
            <Campo label="Teléfono" value={telefono} onChange={setTelefono} edit={modoEdicion} />
            <Campo label="Rol" value={rol} onChange={setRol} edit={modoEdicion} />
            <Campo
              label="Centro de formación"
              value={centro}
              onChange={setCentro}
              edit={modoEdicion}
            />
          </div>

          <div className="mt-10 text-right space-x-3">
            {modoEdicion ? (
              <>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                  onClick={() => setModoEdicion(false)}
                >
                  Guardar cambios
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg"
                  onClick={() => setModoEdicion(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                onClick={() => setModoEdicion(true)}
              >
                <Pencil className="w-4 h-4" />
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

function Campo({
  label,
  value,
  onChange,
  edit,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  edit: boolean;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">{label}</h2>
      {edit ? (
        <input
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 outline-cyan-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-lg text-slate-800">{value}</p>
      )}
    </div>
  );
}
