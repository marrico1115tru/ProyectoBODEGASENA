import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Key, useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";

export default function UsuariosMayorUso() {
  const containerRef = useRef(null); // Ahora apuntamos al contenedor más grande que incluye toda la vista.

  const { data, isLoading, error } = useQuery({
    queryKey: ["usuarios-mayor-uso-productos"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3500/api/usuarios/usuarios-mayor-uso-productos");
      return res.data;
    },
  });

  const exportarPDF = () => {
    if (!containerRef.current) return;
    html2pdf()
      .set({
        margin: 0.3,
        filename: "usuarios_mayor_uso_productos.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(containerRef.current) // Exportamos todo el contenedor
      .save();
  };

  if (isLoading) return <p className="p-6 text-lg text-center">Cargando...</p>;
  if (error) return <p className="p-6 text-lg text-red-600 text-center">Error al cargar datos.</p>;

  return (
    <DefaultLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-6 py-12">
        <div className="w-full max-w-5xl text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-3">
            Usuarios con Mayor Uso de Productos
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Este reporte muestra los usuarios que más han utilizado productos, clasificados por su historial
            de uso. Puedes exportar esta información en formato PDF.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <Button
            onClick={exportarPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Exportar PDF
          </Button>
        </div>

        {/* Cambié el contenedor a este div para que incluya toda la vista */}
        <div ref={containerRef} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-5xl">
          <table className="w-full text-center border-collapse">
            <thead className="bg-blue-200 text-blue-900 text-lg">
              <tr>
                <th className="p-4 border-b">#</th>
                <th className="p-4 border-b">Nombre</th>
                <th className="p-4 border-b">Apellido</th>
                <th className="p-4 border-b">Historial de Productos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((usuario: { id: Key | null | undefined; nombre: string; apellido: string; _count: { historial: any }; }, index: number) => (
                <tr key={usuario.id} className="hover:bg-blue-50 text-base">
                  <td className="p-4 border-b font-bold text-blue-700">{index + 1}</td>
                  <td className="p-4 border-b text-blue-800">{usuario.nombre}</td>
                  <td className="p-4 border-b text-blue-800">{usuario.apellido}</td>
                  <td className="p-4 border-b text-blue-800">{usuario._count?.historial || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
