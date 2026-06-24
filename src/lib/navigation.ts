export type MegaItem = { label: string; slug: string };
export type MegaColumn = { title: string; items: MegaItem[] };

/** Ordem das colunas no menu suspenso de Produtos */
export const MEGA_COLUMN_ORDER = [
  "Banheiro Acessível",
  "Pisos Táteis - TOC e ART",
  "Linha Acessibilidade",
] as const;

/** Fallback enquanto o menu carrega ou se o banco estiver indisponível */
export const DEFAULT_MEGA_COLUMNS: MegaColumn[] = [
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

export const buildMegaColumnsFromCategories = (
  categories: Array<{ name: string; slug: string; mega_column: string | null; sort_order: number }>,
  columnOrder: readonly string[] = MEGA_COLUMN_ORDER,
): MegaColumn[] => {
  const grouped = new Map<string, MegaItem[]>();

  for (const category of categories) {
    const columnTitle = category.mega_column?.trim() || "Outros";
    const items = grouped.get(columnTitle) ?? [];
    items.push({ label: category.name, slug: category.slug });
    grouped.set(columnTitle, items);
  }

  const columns: MegaColumn[] = [];
  const used = new Set<string>();

  for (const title of columnOrder) {
    const items = grouped.get(title);
    if (items?.length) {
      columns.push({ title, items });
      used.add(title);
    }
  }

  for (const [title, items] of grouped.entries()) {
    if (!used.has(title) && items.length > 0) {
      columns.push({ title, items });
    }
  }

  return columns;
};

export type NavItem = {
  label: string;
  to: string;
  mega?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Início", to: "/" },
  { label: "Produtos", to: "/produtos", mega: true },
  { label: "Contato", to: "/contato" },
  { label: "Quem Somos", to: "/quem-somos" },
  { label: "Trocas e Devoluções", to: "/trocas-e-devolucoes" },
  { label: "Política de Privacidade", to: "/politica-de-privacidade" },
  { label: "Normas de Acessibilidade", to: "/normas-de-acessibilidade" },
  { label: "Blog", to: "/blog" },
];

/** @deprecated Use fetchMegaMenuColumns() — mantido só para compatibilidade */
export const megaColumns = DEFAULT_MEGA_COLUMNS;
export const allCategories = DEFAULT_MEGA_COLUMNS.flatMap((c) => c.items);
