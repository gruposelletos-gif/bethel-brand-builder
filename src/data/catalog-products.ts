import produtoAssento from "@/assets/produto-assento-articulado.jpg";
import produtoBarraU from "@/assets/produto-barra-u.jpg";
import produtoBarraReta1 from "@/assets/produto-barra-reta-1.jpg";
import produtoAlarme from "@/assets/produto-alarme-pcd.jpg";
import produtoChapa from "@/assets/produto-chapa-inox.jpg";
import produtoPlaca from "@/assets/produto-placa-inox-1.jpg";
import produtoPisoDirecionalAlerta from "@/assets/produto-piso-tatil-direcional-alerta.jpg";
import produtoAcabamentoInox from "@/assets/produto-placa-inox-2.jpg";
import produtoPlacaBraille from "@/assets/produto-placa-braille-pne.jpg";
import produtoFitaSinalizacao from "@/assets/produto-fita-fotoluminescente-sinalizacao.jpg";
import produtoPisoTatilPvc from "@/assets/produto-piso-tatil-pvc.jpg";

export interface CatalogProductSeed {
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  imageKey: string;
  sort_order: number;
}

/** Mapa de chaves de imagem → URL do asset local (usado no banco como asset:nome.jpg) */
export const catalogAssetMap: Record<string, string> = {
  "produto-assento-articulado.jpg": produtoAssento,
  "produto-barra-u.jpg": produtoBarraU,
  "produto-barra-reta-1.jpg": produtoBarraReta1,
  "produto-alarme-pcd.jpg": produtoAlarme,
  "produto-chapa-inox.jpg": produtoChapa,
  "produto-placa-inox-1.jpg": produtoPlaca,
  "produto-piso-tatil-direcional-alerta.jpg": produtoPisoDirecionalAlerta,
  "produto-placa-inox-2.jpg": produtoAcabamentoInox,
  "produto-placa-braille-pne.jpg": produtoPlacaBraille,
  "produto-fita-fotoluminescente-sinalizacao.jpg": produtoFitaSinalizacao,
  "produto-piso-tatil-pvc.jpg": produtoPisoTatilPvc,
};

export const catalogProducts: CatalogProductSeed[] = [
  {
    name: "Banco Articulado 70x45",
    slug: "banco-articulado-70x45",
    description:
      "Assento articulado em inox desenvolvido para proporcionar mais segurança, acessibilidade e conforto em ambientes adaptados. Ideal para banheiros acessíveis, oferece resistência, durabilidade e excelente acabamento.",
    categorySlug: "barra-de-apoio",
    imageKey: "produto-assento-articulado.jpg",
    sort_order: 10,
  },
  {
    name: "Suporte Lateral de Lavatório",
    slug: "suporte-lateral-de-lavatorio",
    description:
      'Barra de apoio em formato "U", fabricada para oferecer maior estabilidade, apoio e segurança ao usuário. Indicada para banheiros acessíveis e espaços adaptados, com estrutura resistente e acabamento de alta qualidade.',
    categorySlug: "barra-de-apoio",
    imageKey: "produto-barra-u.jpg",
    sort_order: 20,
  },
  {
    name: "Barra Reta de Apoio",
    slug: "barra-reta-de-apoio",
    description:
      "Barra de apoio reta produzida com alta resistência e excelente acabamento. Indicada para auxiliar na mobilidade e dar mais segurança em áreas acessíveis, atendendo diferentes necessidades de instalação.",
    categorySlug: "barra-de-apoio",
    imageKey: "produto-barra-reta-1.jpg",
    sort_order: 30,
  },
  {
    name: "Elemento Tátil PVC",
    slug: "elemento-tatil-pvc",
    description:
      "Elemento Tátil em PVC, leve e resistente, ideal para garantir acessibilidade com ótimo custo-benefício. Fácil de instalar, possui boa durabilidade e proporciona orientação segura em diversos ambientes.",
    categorySlug: "elemento-tatil",
    imageKey: "produto-alarme-pcd.jpg",
    sort_order: 40,
  },
  {
    name: "Elemento Tátil Inox Adesivado",
    slug: "elemento-tatil-inox-adesivado",
    description:
      "Elemento Tátil em inox adesivado, prático e de fácil instalação, ideal para garantir acessibilidade sem necessidade de perfuração. Resistente e com acabamento moderno, oferece ótima aderência e durabilidade para uso em diversos ambientes.",
    categorySlug: "elemento-tatil",
    imageKey: "produto-chapa-inox.jpg",
    sort_order: 50,
  },
  {
    name: "Elemento Tátil Inox",
    slug: "elemento-tatil-inox",
    description:
      "Elemento Tátil em inox de alta durabilidade, ideal para garantir acessibilidade e segurança em ambientes internos e externos. Resistente à corrosão, possui acabamento moderno e excelente fixação, proporcionando orientação eficiente e longa vida útil.",
    categorySlug: "piso-tatil-inox",
    imageKey: "produto-placa-inox-1.jpg",
    sort_order: 60,
  },
  {
    name: "Piso Tátil Concreto",
    slug: "piso-tatil-concreto",
    description:
      "Piso tátil em concreto, robusto e altamente resistente, ideal para áreas externas. Garante acessibilidade com segurança, suportando alto fluxo e variações climáticas com excelente durabilidade.",
    categorySlug: "piso-tatil-concreto",
    imageKey: "produto-piso-tatil-direcional-alerta.jpg",
    sort_order: 70,
  },
  {
    name: "Elemento Tátil Inox com Parafuso",
    slug: "elemento-tatil-inox-com-parafuso",
    description:
      "Elemento tátil em inox com fixação por parafuso, garantindo máxima firmeza e segurança. Ideal para locais de alto fluxo, oferece alta durabilidade, resistência e acabamento moderno.",
    categorySlug: "piso-tatil-inox",
    imageKey: "produto-placa-inox-2.jpg",
    sort_order: 80,
  },
  {
    name: "Placa em Braille – Sanitário PNE / Unissex",
    slug: "placa-em-braille-sanitario-pne-unissex",
    description:
      "Placa de sinalização em braille para sanitário PNE e unissex, produzida para garantir identificação acessível, leitura tátil e comunicação inclusiva em ambientes adaptados. Produto com acabamento profissional e excelente legibilidade.",
    categorySlug: "braille",
    imageKey: "produto-placa-braille-pne.jpg",
    sort_order: 90,
  },
  {
    name: "Sinalizador de Degrau Fotoluminescente",
    slug: "sinalizador-de-degrau-fotoluminescente",
    description:
      "Sinalizador de degrau fotoluminescente, ideal para aumentar a segurança em escadas e desníveis. Brilha no escuro após exposição à luz, garantindo visibilidade mesmo em falta de energia, com fácil aplicação e alta durabilidade.",
    categorySlug: "faixa-de-sinalizacao-acessibilidade",
    imageKey: "produto-fita-fotoluminescente-sinalizacao.jpg",
    sort_order: 100,
  },
  {
    name: "Piso Tátil de PVC",
    slug: "piso-tatil-de-pvc",
    description:
      "Piso Tátil de PVC desenvolvido para proporcionar acessibilidade e segurança em diversos ambientes. Fabricado com material resistente e antiderrapante, oferece fácil instalação, alta durabilidade e excelente acabamento para áreas internas e externas.",
    categorySlug: "piso-tatil-pvc",
    imageKey: "produto-piso-tatil-pvc.jpg",
    sort_order: 110,
  },
];

export const assetImageRef = (imageKey: string) => `asset:${imageKey}`;
