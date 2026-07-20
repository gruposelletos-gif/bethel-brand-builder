import { useState } from "react";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/logo-bethel.png";
import { DEFAULT_MEGA_COLUMNS, navItems } from "@/lib/navigation";
import { fetchMegaMenuColumns } from "@/lib/products";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMega, setHoveredMega] = useState<string | null>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: megaColumns = DEFAULT_MEGA_COLUMNS } = useQuery({
    queryKey: ["mega-menu"],
    queryFn: fetchMegaMenuColumns,
    staleTime: 60_000,
  });

  const closeAll = () => {
    setIsOpen(false);
    setMobileProductsOpen(false);
    setHoveredMega(null);
  };

  const go = (to: string) => {
    closeAll();
    navigate(to);
  };

  const megaGridClass =
    megaColumns.length <= 1
      ? "grid-cols-1"
      : megaColumns.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] text-white border-b border-white/10 shadow-[0_8px_30px_-12px_hsla(var(--navy),0.6)]"
      style={{ background: "linear-gradient(135deg, hsl(var(--navy)) 0%, hsl(var(--primary)) 100%)" }}
    >
      <div className="container-bethel flex items-center justify-between h-28 lg:h-32 px-4 lg:px-8">
        <Link to="/" onClick={closeAll} className="flex-shrink-0">
          <img
            src={logo}
            alt="BETHEL"
            className="h-[5.75rem] lg:h-[7.25rem] w-auto object-contain brightness-0 invert"
          />
        </Link>

        {/* Desktop nav - centered */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-6">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.mega && setHoveredMega(item.label)}
              onMouseLeave={() => item.mega && setHoveredMega(null)}
            >
              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={closeAll}
                className={({ isActive }) =>
                  `flex items-center gap-1 font-heading text-sm font-medium tracking-wide transition-colors py-2 relative group ${
                    isActive ? "text-white" : "text-white/85 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {item.mega && <ChevronDown size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />}
                    <span
                      className={`absolute left-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-teal-light to-white transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </div>
          ))}
        </nav>

        <Link
          // spacing tweak: separa visualmente do último item do menu

          to="/auth"
          onClick={closeAll}
          className="hidden lg:inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-4 py-2 font-heading text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          <LogIn size={16} />
          Entrar
        </Link>

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
            className="hidden lg:block absolute left-0 right-0 top-full border-t border-white/10 shadow-2xl z-[100]"
            style={{ background: "linear-gradient(180deg, hsl(var(--navy)) 0%, hsl(var(--primary)) 100%)" }}
          >
            <div className="container-bethel px-8 py-12">
              <div className={cn("grid gap-8", megaGridClass)}>
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
                        <li key={sub.slug}>
                          <button
                            onClick={() => go(`/produtos/${sub.slug}`)}
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
            className="lg:hidden border-t border-white/10 overflow-hidden"
            style={{ background: "linear-gradient(180deg, hsl(var(--navy)) 0%, hsl(var(--primary)) 100%)" }}
          >
            <nav className="flex flex-col px-4 py-4 gap-1 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) =>
                item.mega ? (
                  <div key={item.label} className="border-b border-white/10">
                    <div className="w-full flex items-center justify-between">
                      <button
                        onClick={() => go(item.to)}
                        className="flex-1 font-heading text-sm font-semibold text-white py-3 text-left"
                      >
                        {item.label}
                      </button>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        aria-label="Expandir submenu"
                        className="p-3"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    <AnimatePresence>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 pb-3"
                        >
                          {megaColumns.map((col) => (
                            <div key={col.title} className="mt-3">
                              <p className="font-heading text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                                {col.title}
                              </p>
                              <ul className="space-y-1.5 pl-2">
                                {col.items.map((sub) => (
                                  <li key={sub.slug}>
                                    <button
                                      onClick={() => go(`/produtos/${sub.slug}`)}
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
                    onClick={() => go(item.to)}
                    className="font-heading text-sm font-semibold text-white/90 hover:text-white py-3 text-left border-b border-white/10 transition-colors"
                  >
                    {item.label}
                  </button>
                )
              )}
              <Link
                to="/auth"
                onClick={closeAll}
                className="mt-2 flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-4 py-3 font-heading text-sm font-semibold text-white"
              >
                <LogIn size={16} />
                Entrar
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
