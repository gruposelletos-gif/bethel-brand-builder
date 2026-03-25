import { motion } from "framer-motion";
import { Search, Wrench, Settings, ClipboardList, UserCheck, Headphones } from "lucide-react";

const services = [
  { icon: Search, title: "Consultoria", desc: "Análise técnica e orientação profissional para projetos de acessibilidade." },
  { icon: Wrench, title: "Instalação", desc: "Instalação profissional de produtos com garantia de qualidade e segurança." },
  { icon: Settings, title: "Manutenção", desc: "Serviços de manutenção preventiva e corretiva para equipamentos." },
  { icon: ClipboardList, title: "Execução de Projetos", desc: "Planejamento e execução completa de projetos de acessibilidade." },
  { icon: UserCheck, title: "Atendimento Personalizado", desc: "Soluções sob medida para necessidades específicas de cada cliente." },
  { icon: Headphones, title: "Suporte Técnico", desc: "Assistência técnica especializada com agilidade e eficiência." },
];

const ServicesSection = () => (
  <section id="servicos" className="section-padding bg-background">
    <div className="container-bethel">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Nossos <span className="text-gradient">serviços</span>
        </h2>
        <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        <p className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
          Além da comercialização de produtos, a BETHEL também oferece serviços especializados, com foco em atendimento de qualidade, agilidade e excelência na execução.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 gradient-primary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <s.icon className="text-primary-foreground" size={24} />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">{s.title}</h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
