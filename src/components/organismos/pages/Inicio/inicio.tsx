import DefaultLayout from "@/layouts/default";
import { Card } from "@/components/ui/card";
import { Users, PackageCheck, Layers, LayoutDashboard, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import { useDashboardData } from "@/Api/Dashboard/DashboardData";
import { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";

const images = [
  { id: 1, title: "Agropecuario", src: "src/img/agropecuarioimg.jpeg", link: "/agropecuario" },
  { id: 2, title: "Ambiental", src: "src/img/ambientalimg.jpeg", link: "/ambiental" },
  { id: 3, title: "Tecnología", src: "src/img/ticsimg.jpeg", link: "/tecnologia" },
  { id: 4, title: "Escuela de Café", src: "src/img/cafeimg.jpeg", link: "/tecnologia" },
];

function AutoplayPlugin(slider: any) {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 2500);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

interface Permisos {
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
}

export default function Inicio() {
  const navigate = useNavigate();
  const [sliderRef] = useKeenSlider<HTMLDivElement>({ loop: true, slides: { perView: 1 } }, [AutoplayPlugin]);
  const { data, loading } = useDashboardData();
  const [permisos, setPermisos] = useState<Permisos>({
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
  });

  useEffect(() => {
    const fetchPermisos = async () => {
      const idRol = localStorage.getItem("idRol");
      const ruta = "/inicio";
      if (!idRol) return;

      try {
        const res = await fetch(`http://localhost:3000/permisos/por-ruta?ruta=${ruta}&idRol=${idRol}`);
        const json = await res.json();
        if (json?.data) setPermisos(json.data);
      } catch (error) {
        console.error("Error al obtener permisos:", error);
      }
    };

    fetchPermisos();
  }, []);

  const recentActivity = [...data.productos]
    .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
    .slice(0, 5)
    .map((p) => ({
      fecha: new Date(p.fecha_creacion).toLocaleDateString(),
      actividad: `Producto creado: ${p.nombre}`,
    }));

  return (
    <DefaultLayout>
      <div className="space-y-8 px-4 py-6 bg-gray-50 min-h-screen">
        {!permisos.puedeVer ? (
          <div className="text-center mt-20">
            <p className="text-red-600 font-semibold text-lg">🚫 No tienes permiso para ver esta página.</p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">¡Bienvenida, María!</h1>
              <p className="text-muted-foreground text-sm">Aquí puedes visualizar el resumen del sistema de inventario.</p>
            </div>

            {/* Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total de Usuarios</p>
                    <h2 className="text-2xl font-extrabold text-gray-800">{loading ? "..." : data.totalUsuarios}</h2>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="shadow-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Productos</p>
                    <h2 className="text-2xl font-extrabold text-gray-800">{loading ? "..." : data.totalProductos}</h2>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PackageCheck className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="shadow-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Áreas</p>
                    <h2 className="text-2xl font-extrabold text-gray-800">{loading ? "..." : data.totalAreas}</h2>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="shadow-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Resumen</p>
                    <h2 className="text-2xl font-extrabold text-gray-800">
                      {loading
                        ? "..."
                        : Math.floor(((data.totalUsuarios + data.totalProductos + data.totalAreas) / 500) * 100) + "%"}
                    </h2>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Galería */}
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-700 border-b pb-1 border-gray-200">Galería Destacada</h2>
              <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden shadow-md">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="keen-slider__slide cursor-pointer relative"
                    onClick={() => navigate(img.link)}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-64 object-cover rounded-xl transform transition-transform duration-300 hover:scale-105 shadow-sm"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 text-lg font-semibold rounded-b-xl">
                      {img.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividades recientes */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-1 border-gray-200">Últimas Actividades</h2>
              <ul className="space-y-2 text-sm">
                {recentActivity.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-gray-700">
                    <span>{item.actividad}</span>
                    <span className="text-muted-foreground">{item.fecha}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Ejemplo de permisos de acciones */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-1 border-gray-200">Acciones permitidas</h2>
              <div className="flex gap-4 items-center">
                {permisos.puedeCrear && (
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <PlusCircle size={18} /> Crear
                  </button>
                )}
                {permisos.puedeEditar && (
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <Pencil size={18} /> Editar
                  </button>
                )}
                {permisos.puedeEliminar && (
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <Trash2 size={18} /> Eliminar
                  </button>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
