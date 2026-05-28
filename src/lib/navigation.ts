export type MegaItem = { label: string; slug: string };
export type MegaColumn = { title: string; items: MegaItem[] };

export const megaColumns: MegaColumn[] = [
  {
    title: "Banheiro Acessível",
    items: [
      { label: "Barra de Apoio", slug: "barra-de-apoio" },
      { label: "Escada Acessível", slug: "escada-acessivel" },
      { label: "Faixa de Sinalização", slug: "faixa-de-sinalizacao" },
      { label: "Braille para Corrimão", slug: "braille-para-corrimao" },
    ],
  },
  {
    title: "Pisos Táteis - TOC e ART",
    items: [
      { label: "Piso Tátil PVC", slug: "piso-tatil-pvc" },
      { label: "Piso Tátil de Concreto", slug: "piso-tatil-concreto" },
      { label: "Elemento Tátil", slug: "elemento-tatil" },
      { label: "Piso Tátil Inox", slug: "piso-tatil-inox" },
    ],
  },
  {
    title: "Linha Acessibilidade",
    items: [
      { label: "Alarme PCD", slug: "alarme-pcd" },
      { label: "Braille", slug: "braille" },
      { label: "Faixa de Sinalização", slug: "faixa-de-sinalizacao-acessibilidade" },
      { label: "Adesivos e Placas", slug: "adesivos-e-placas" },
      { label: "Mapa Tátil", slug: "mapa-tatil" },
    ],
  },
];

export type NavItem = {
  label: string;
  to: string;
  mega?: MegaColumn[];
};

export const navItems: NavItem[] = [
  { label: "Início", to: "/" },
  { label: "Produtos", to: "/produtos", mega: megaColumns },
  { label: "Contato", to: "/contato" },
  { label: "Quem Somos", to: "/quem-somos" },
  { label: "Trocas e Devoluções", to: "/trocas-e-devolucoes" },
  { label: "Política de Privacidade", to: "/politica-de-privacidade" },
  { label: "Normas de Acessibilidade", to: "/normas-de-acessibilidade" },
  { label: "Blog", to: "/blog" },
];

export const allCategories = megaColumns.flatMap((c) => c.items);
