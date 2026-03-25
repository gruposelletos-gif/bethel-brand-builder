import { Instagram, Facebook, Linkedin } from "lucide-react";
import logo from "@/assets/logo-bethel.png";

const Footer = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container-bethel section-padding pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img src={logo} alt="BETHEL" className="h-20 w-auto mb-4 rounded-lg bg-primary-foreground/90 p-2" />
            <p className="font-body text-primary-foreground/70 text-sm leading-relaxed">
              Comércio de produtos de acessibilidade e prestação de serviços com qualidade e excelência.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-4 tracking-wide">MENU</h4>
            <nav className="flex flex-col gap-2">
              {["Início|#inicio", "Sobre|#sobre", "Produtos|#produtos", "Serviços|#servicos", "Portfólio|#portfolio", "Contato|#contato"].map((item) => {
                const [label, href] = item.split("|");
                return (
                  <button key={href} onClick={() => scrollTo(href)} className="text-left font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-4 tracking-wide">CONTATO</h4>
            <div className="space-y-2 font-body text-sm text-primary-foreground/70">
              <p>(00) 0000-0000</p>
              <p>contato@bethel.com.br</p>
              <p>Rua Exemplo, 123 — Cidade/UF</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-4 tracking-wide">REDES SOCIAIS</h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon size={18} className="text-primary-foreground/80" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            © 2026 BETHEL. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
