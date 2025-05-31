import DefaultLayout from "@/layouts/default";
import { Card } from "@/components/ui/card";
import { Users, PackageCheck, Layers, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const images = [
  {
    id: 1,
    title: "Agropecuario",
    src: "src/img/agropecuarioimg.jpeg",
    link: "/agropecuario",
  },
  {
    id: 2,
    title: "Ambiental",
    src: "src/img/ambientalimg.jpeg",
    link: "/ambiental",
  },
  {
    id: 3,
    title: "Tecnología",
    src: "src/img/ticsimg.jpeg",
    link: "/tecnologia",
  },
   {
    id: 3,
    title: "Escuela de Cafe",
    src: "src/img/cafeimg.jpeg",
    link: "/tecnologia",
  },
];

// 🔁 Plugin Autoplay con velocidad ajustada
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
    }, 1500); // ✅ Más rápido: 1.5 segundos
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: { perView: 1 },
    },
    [AutoplayPlugin]
  );

  return (
    <DefaultLayout>
      <div className="space-y-6 px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuarios</p>
                <h2 className="text-2xl font-bold">123</h2>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <h2 className="text-2xl font-bold">245</h2>
              </div>
              <PackageCheck className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Áreas</p>
                <h2 className="text-2xl font-bold">15</h2>
              </div>
              <Layers className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resumen</p>
                <h2 className="text-2xl font-bold">89%</h2>
              </div>
              <LayoutDashboard className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Carrusel con autoplay más rápido */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Galería Destacada</h2>
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
                  className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 text-lg font-semibold rounded-b-xl">
                  {img.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
