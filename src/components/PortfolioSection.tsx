import { motion } from "framer-motion";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import p7 from "@/assets/portfolio-7.jpg";

const projects = [
  { img: p1, title: "Piso Tátil — Sinalização de Alerta e Direcional", desc: "Instalação de piso tátil com sinalização de alerta e direcional em ambiente interno." },
  { img: p2, title: "Piso Tátil — Área de Bebedouros", desc: "Implantação de piso tátil direcional e de alerta em área de bebedouros acessíveis." },
  { img: p3, title: "Sinalização Tátil — Corredor Completo", desc: "Execução de rota acessível completa com piso tátil direcional e de alerta em corredor." },
  { img: p4, title: "Rota Acessível — Cruzamento Direcional", desc: "Instalação de cruzamento de piso tátil com mudança de direção em espaço amplo." },
  { img: p5, title: "Piso Tátil — Acesso a Sanitários", desc: "Rota acessível com piso tátil direcional guiando até os sanitários adaptados." },
  { img: p6, title: "Sinalização Tátil — Percurso em L", desc: "Execução de rota tátil com curva e sinalização de alerta em área de espera." },
  { img: p7, title: "Rota Acessível — Elevador e Salas", desc: "Instalação de piso tátil direcional conectando elevador acessível às salas adjacentes." },
];

const PortfolioSection = () => (
  <section id="portfolio" className="section-padding bg-muted">
    <div className="container-bethel">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          <span className="text-gradient">Projetos Finalizados</span>
        </h2>
        <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        <p className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
          Confira alguns projetos já executados pela Bethel, com soluções voltadas para acessibilidade, segurança e qualidade de execução.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                width={800}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-heading text-base font-bold text-foreground mb-1.5">{p.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PortfolioSection;
