import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";

export default function UsuariosPorRolActividad() {
  const containerRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["usuarios-por-rol-actividad"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3500/api/usuarios/usuarios-por-rol-actividad"
      );
      return res.data;
    },
  });

  const exportarPDF = () => {
    if (!containerRef.current) return;
    html2pdf()
      .set({
        margin: 0.3,
        filename: "usuarios_por_rol_actividad.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(containerRef.current)
      .save();
  };

  if (isLoading) return <p className="p-6 text-lg text-center">Cargando...</p>;
  if (error) return <p className="p-6 text-lg text-red-600 text-center">Error al cargar datos.</p>;

  return (
    <DefaultLayout>
      <div className="p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col items-center">
        <div className="w-full max-w-7xl text-center mb-10 relative px-4">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-3">
            Usuarios por Rol y Actividad
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Este informe presenta los usuarios agrupados por su rol en el sistema, junto con su actividad en solicitudes y entregas. Puedes exportar esta información como PDF.
          </p>
          <div className="absolute right-10 top-0">
            <Button
              onClick={exportarPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md"
            >
              Exportar PDF
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-7xl space-y-10"
        >
          {data.map((rol: { nombreRol: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; usuarios: { id: Key | null | undefined; nombre: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; apellido: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; email: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; _count: { solicitudes: any; entregas: any; }; }[]; }, i: Key | null | undefined) => (
            <div key={i}>
              <h2 className="text-2xl font-semibold text-indigo-700 border-b border-indigo-200 pb-2 mb-6 text-center">
                {rol.nombreRol}
              </h2>

              {rol.usuarios.length === 0 ? (
                <p className="text-gray-500 italic text-lg text-center">No hay usuarios en este rol.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-indigo-100 text-indigo-800 text-lg">
                        <th className="p-4 border-b">Nombre</th>
                        <th className="p-4 border-b">Correo</th>
                        <th className="p-4 border-b">Solicitudes</th>
                        <th className="p-4 border-b">Entregas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rol.usuarios.map((usuario: { id: Key | null | undefined; nombre: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; apellido: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; email: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; _count: { solicitudes: any; entregas: any; }; }) => (
                        <tr key={usuario.id} className="hover:bg-blue-50 text-base">
                          <td className="p-4 border-b font-medium">
                            {usuario.nombre} {usuario.apellido}
                          </td>
                          <td className="p-4 border-b text-gray-700">{usuario.email}</td>
                          <td className="p-4 border-b">{usuario._count?.solicitudes || 0}</td>
                          <td className="p-4 border-b">{usuario._count?.entregas || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
