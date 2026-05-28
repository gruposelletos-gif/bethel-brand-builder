import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/logo-bethel.png";

type MenuItem = {
  label: string;
  href: string;
  mega?: { title: string; items: { label: string; href: string }[] }[];
};

const megaColumns = [
  {
    title: "Banheiro Acessível",
    items: [
      { label: "Barra de Apoio", href: "#produtos" },
      { label: "Escada Acessível", href: "#produtos" },
      { label: "Faixa de Sinalização", href: "#produtos" },
      { label: "Braille para Corrimão", href: "#produtos" },
    ],
  },
  {
    title: "Pisos Táteis - TOC e ART",
    items: [
      { label: "Piso Tátil PVC", href: "#produtos" },
      { label: "Piso Tátil de Concreto", href: "#produtos" },
      { label: "Elemento Tátil", href: "#produtos" },
      { label: "Piso Tátil Inox", href: "#produtos" },
    ],
  },
  {
    title: "Linha Acessibilidade",
    items: [
      { label: "Alarme PCD", href: "#produtos" },
      { label: "Braille", href: "#produtos" },
      { label: "Faixa de Sinalização", href: "#produtos" },
      { label: "Adesivos e Placas", href: "#produtos" },
      { label: "Mapa Tátil", href: "#produtos" },
    ],
  },
];

const navItems: MenuItem[] = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos", mega: megaColumns },
  { label: "Contato", href: "#contato" },
  { label: "Quem Somos", href: "#sobre" },
  { label: "Trocas e Devoluções", href: "#contato" },
  { label: "Política de Privacidade", href: "#contato" },
  { label: "Normas de Acessibilidade", href: "#servicos" },
  { label: "Blog", href: "#portfolio" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMega, setHoveredMega] = useState<string | null>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const scrollTo = (href: string) => {
    setIsOpen(false);
    setMobileProductsOpen(false);
    setHoveredMega(null);
    setTimeout(() => {
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      const header = document.querySelector("header");
      const offset = header ? (header as HTMLElement).offsetHeight : 0;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }, 280);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] text-white border-b border-white/10 shadow-[0_8px_30px_-12px_hsla(var(--navy),0.4)] backdrop-blur-md" style={{ background: "linear-gradient(135deg, hsl(var(--navy)) 0%, hsl(var(--primary)) 100%)" }}>
      <div className="container-bethel flex items-center justify-between h-20 md:h-24 px-4 lg:px-8">
        <button onClick={() => scrollTo("#inicio")} className="flex-shrink-0">
          <img src={logo} alt="BETHEL" className="h-14 md:h-16 w-auto object-contain brightness-0 invert" />
        </button>

        {/* Desktop nav - centered */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.mega && setHoveredMega(item.label)}
              onMouseLeave={() => item.mega && setHoveredMega(null)}
            >
              <button
                onClick={() => scrollTo(item.href)}
                className="flex items-center gap-1 font-heading text-sm font-medium tracking-wide text-white/85 hover:text-white transition-colors py-2 relative group"
              >
                {item.label}
                {item.mega && <ChevronDown size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />}
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-teal-light to-white group-hover:w-full transition-all duration-300" />
              </button>
            </div>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Mega Menu */}
      <AnimatePresence>
        {hoveredMega === "Produtos" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setHoveredMega("Produtos")}
            onMouseLeave={() => setHoveredMega(null)}
            className="hidden lg:block absolute left-0 right-0 top-full border-t border-white/10 shadow-2xl backdrop-blur-xl"
            style={{ background: "linear-gradient(180deg, hsla(var(--navy), 0.98) 0%, hsla(var(--primary), 0.96) 100%)" }}
          >
            <div className="container-bethel px-8 py-12">
              <div className="grid grid-cols-3 gap-8">
                {megaColumns.map((col, idx) => (
                  <div
                    key={col.title}
                    className={idx > 0 ? "lg:pl-8 lg:border-l lg:border-white/10" : ""}
                  >
                    <h3 className="font-heading text-xs font-bold tracking-[0.15em] uppercase text-white mb-5 pb-3 border-b border-white/15 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-light" />
                      {col.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {col.items.map((sub) => (
                        <li key={sub.label}>
                          <button
                            onClick={() => scrollTo(sub.href)}
                            className="font-body text-sm text-white/75 hover:text-white hover:translate-x-1.5 transition-all duration-200 tracking-wide text-left flex items-center gap-2 group/sub"
                          >
                            <span className="h-px w-3 bg-white/30 group-hover/sub:w-5 group-hover/sub:bg-teal-light transition-all duration-200" />
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-black border-t border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) =>
                item.mega ? (
                  <div key={item.label} className="border-b border-white/10">
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="w-full flex items-center justify-between font-heading text-sm font-semibold text-white py-3"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 pb-3"
                        >
                          {item.mega.map((col) => (
                            <div key={col.title} className="mt-3">
                              <p className="font-heading text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                                {col.title}
                              </p>
                              <ul className="space-y-1.5 pl-2">
                                {col.items.map((sub) => (
                                  <li key={sub.label}>
                                    <button
                                      onClick={() => scrollTo(sub.href)}
                                      className="text-sm text-white/70 hover:text-white py-1 text-left uppercase tracking-wide"
                                    >
                                      {sub.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.href)}
                    className="font-heading text-sm font-semibold text-white/90 hover:text-white py-3 text-left border-b border-white/10 transition-colors"
                  >
                    {item.label}
                  </button>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
