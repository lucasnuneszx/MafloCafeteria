// Contact links and business hours live in `site_settings` (see @/lib/site-settings).
import type { Testimonial, GalleryImage } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Fui numa quarta de manhã pra trabalhar um pouco e acabei ficando quase 3 horas. Pedi um flat white e uma torta salgada, os dois vieram rápido. Tem tomada perto da maioria das mesas, o que ajuda bastante. Só achei o espaço meio cheio no horário de almoço.",
    author: "Julia S.",
  },
  {
    id: "t2",
    quote:
      "Já fui umas 4 vezes desde que abriu. O café é bom mesmo, não é só instagramável — já experimentei o V60 e o prensa francesa e os dois vieram bem explicados. O preço é um pouco salgado pra ir toda semana, mas pra ocasião especial vale.",
    author: "Bruno M.",
  },
  {
    id: "t3",
    quote:
      "Marquei uma reunião rápida lá com um cliente e gostei do ambiente, bem tranquilo pra conversar. O atendimento foi atencioso. Não sabia que precisava reservar mesa maior com antecedência pra grupo, então fica a dica pra quem for em mais gente.",
    author: "Mariana F.",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "g8",
    src: "/images/ambiente-salao.jpg",
    alt: "Salão da Maflô com pergolado de flores brancas sobre as mesas, iluminação em fitas de LED e mobiliário de madeira",
    width: 960,
    height: 1280,
  },
  {
    id: "g4",
    src: "/images/croissant.jpg",
    alt: "Croissant artesanal servido em tábua de madeira",
    width: 943,
    height: 1280,
  },
  {
    id: "g9",
    src: "/images/torta-salgada.jpg",
    alt: "Torta salgada da casa decorada com ervas frescas",
    width: 1600,
    height: 1200,
  },
  {
    id: "g10",
    src: "/images/gallery-09.jpg",
    alt: "Tortinhas salgadas gratinadas, recém-saídas do forno",
    width: 964,
    height: 1280,
  },
  {
    id: "g11",
    src: "/images/gallery-10.jpg",
    alt: "Camarões empanados e gratinados, prontos para servir",
    width: 1600,
    height: 1200,
  },
  {
    id: "g12",
    src: "/images/gallery-11.jpg",
    alt: "Bolo de chocolate com calda brilhante e detalhe floral",
    width: 1600,
    height: 1200,
  },
  {
    id: "g13",
    src: "/images/gallery-12.jpg",
    alt: "Torta salgada de camarão com chantilly e queijo gratinado",
    width: 1200,
    height: 1600,
  },
  {
    id: "g14",
    src: "/images/gallery-13.jpg",
    alt: "Bolo de canela com cobertura cremosa, recém-preparado",
    width: 1600,
    height: 1200,
  },
  {
    id: "g15",
    src: "/images/gallery-14.jpg",
    alt: "Bolo com farofa crocante de amêndoas",
    width: 1600,
    height: 1200,
  },
  {
    id: "g16",
    src: "/images/gallery-15.jpg",
    alt: "Serviço de chá com bule artesanal na mesa Maflô",
    width: 1600,
    height: 1200,
  },
  {
    id: "g17",
    src: "/images/gallery-16.jpg",
    alt: "Latte art em formato de flor em xícara de porcelana",
    width: 1200,
    height: 1600,
  },
  {
    id: "g18",
    src: "/images/gallery-17.jpg",
    alt: "Torta decorada com filigranas de caramelo e folha de ouro",
    width: 1600,
    height: 1200,
  },
];

export const eventOccasions = [
  "Aniversário",
  "Reunião corporativa",
  "Encontro entre amigos",
  "Celebração em família",
  "Outro",
];

export const dayOfWeekOptions = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Conceito", href: "#conceito" },
  { label: "Ambiente", href: "#experiencia" },
  { label: "Eventos", href: "#eventos" },
  { label: "Agenda", href: "#agenda" },
  { label: "Contato", href: "#localizacao" },
];

const fullAddress = "R. Marcos Freire, 364, Caminho das Árvores, Salvador - BA, 41820-780";

export const address = {
  street: "R. Marcos Freire, 364",
  neighborhood: "Caminho das Árvores",
  city: "Salvador — BA",
  cep: "41820-780",
  // Deep links that open turn-by-turn navigation directly to the Maflô, not just a pin
  googleMapsRouteUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`,
  wazeRouteUrl: `https://waze.com/ul?q=${encodeURIComponent(fullAddress)}&navigate=yes`,
};
