import { motion } from "framer-motion";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const projects = [
  { img: p1, title: "Rampa de Acesso Comercial", desc: "Instalação de rampa acessível em edifício comercial com corrimãos em inox." },
  { img: p2, title: "Banheiro Acessível", desc: "Adaptação completa de banheiro com barras de apoio e acessórios de segurança." },
  { img: p3, title: "Elevador de Acessibilidade", desc: "Instalação de elevador acessível em edifício de uso público." },
  { img: p4, title: "Piso Tátil Urbano", desc: "Implantação de piso tátil direcional em calçadas e espaços públicos." },
];

const PortfolioSection = () => (
  <section id="portfolio" className="section-padding bg-muted">
    <div className="container-bethel">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          <span className="text-gradient">Portfólio</span>
        </h2>
        <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        <p className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
          Conheça alguns dos projetos e obras realizadas pela BETHEL. Cada projeto reflete nosso compromisso com qualidade e excelência.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="aspect-video overflow-hidden">
              <img src={p.img} alt={p.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">{p.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PortfolioSection;
