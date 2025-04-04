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
    image: "https://via.placeholder.com/300x200",
    description: "Descripción del Card 1",
    link: "/pantalla1"
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300x200",
    description: "Descripción del Card 2",
    link: "/pantalla2"
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300x200",
    description: "Descripción del Card 3",
    link: "/pantalla3"
  },
  {
    id: 4,
    image: "https://via.placeholder.com/300x200",
    description: "Descripción del Card 4",
    link: "/pantalla4"
  },
  {
    id: 5,
    image: "https://via.placeholder.com/300x200",
    description: "Descripción del Card 5",
    link: "/pantalla5"
  },
  {
    id: 6,
    image: "https://via.placeholder.com/300x200",
    description: "Descripción del Card 6",
    link: "/pantalla6"
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
