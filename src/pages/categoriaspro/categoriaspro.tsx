import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

const cards = [
  {
    id: 1,
    image: "src/img/limpieza (2).jpeg",
    description: "limpieza esssss",
    link: ""
  },
  {
    id: 2,
    image: "/src/img/ambientalimg.jpeg",
    description: "Espacio responsable y ordenado, diseñado para almacenar materiales y recursos con criterios sostenibles, cuidando cada detalle en armonía con el medio ambiente.",
    link: "/ambiental"
  },
  {
    id: 3,
    image: "/src/img/cafeimg.jpeg",
    description: "Espacio cálido y aromático donde se conservan granos, utensilios y esencias del café, preservando su frescura y sabor para cada taza perfecta.",
    link: "/escuelacafe"
  },
  {
    id: 4,
    image: "/src/img/gastronomiaimg.jpeg",
    description: "Ambiente pulcro y bien conservado, donde ingredientes, utensilios y productos gourmet se almacenan con cuidado, conservando la esencia y calidad de la cocina",
    link: "/gastronomia"
  },
  {
    id: 5,
    image: "/src/img/ticsimg.jpeg",
    description: "Entorno seguro y organizado donde se almacenan equipos, componentes y tecnología, listos para apoyar soluciones digitales con eficiencia e innovación.",
    link: "/tic"
  },
  {
    id: 6,
    image: "/src/img/viasimg.jpeg",
    description: "Espacio técnico y ordenado donde se almacenan materiales e insumos esenciales para la construcción y mantenimiento de caminos, impulsando el desarrollo vial con precisión y seguridad.",
    link: "/vias"
  },
];

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl px-4">
          {cards.map((card) => (
            <Link key={card.id} href={card.link} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={card.image} alt={`Card ${card.id}`} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-gray-700 text-center">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
