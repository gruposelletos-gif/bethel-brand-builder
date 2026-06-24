import { Instagram, Facebook, Linkedin, Mail, MessageCircle, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_FOOTER_SETTINGS,
  fetchFooterSettings,
  footerLogoSrc,
} from "@/lib/footer-settings";
import { footerSocialIconMap } from "@/lib/footer-social";

const Footer = () => {
  const { data: settings = DEFAULT_FOOTER_SETTINGS } = useQuery({
    queryKey: ["footer-settings"],
    queryFn: fetchFooterSettings,
    staleTime: 60_000,
  });

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeSocials = settings.social_links.filter((item) => item.url.trim());

  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container-bethel section-padding pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img
              src={footerLogoSrc(settings.logo_path)}
              alt="BETHEL"
              className="h-28 w-auto mb-4 rounded-lg bg-primary-foreground/90 p-2"
            />
            <p className="font-body text-primary-foreground/70 text-sm leading-relaxed">
              {settings.description}
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
            <div className="space-y-3 font-body text-sm">
              <a
                href={settings.phone_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
              >
                <MessageCircle size={16} className="text-primary-foreground/50 group-hover:text-primary-foreground transition-colors" />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
              >
                <Mail size={16} className="text-primary-foreground/50 group-hover:text-primary-foreground transition-colors" />
                {settings.email}
              </a>
              <a
                href={settings.address_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
              >
                <MapPin size={16} className="text-primary-foreground/50 group-hover:text-primary-foreground transition-colors mt-0.5" />
                {settings.address}
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold mb-4 tracking-wide">REDES SOCIAIS</h4>
            {activeSocials.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {activeSocials.map((item) => {
                  const Icon = footerSocialIconMap[item.icon];
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                    >
                      <Icon size={18} className="text-primary-foreground/80" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-primary-foreground/50">Nenhuma rede social configurada.</p>
            )}
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} BETHEL. Todos os direitos reservados. Criado por{" "}
            <a
              href={DEFAULT_FOOTER_SETTINGS.credit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground transition-colors underline underline-offset-2"
            >
              {DEFAULT_FOOTER_SETTINGS.credit_label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
