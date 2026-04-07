import { motion } from "framer-motion";
import { Search, Wrench, ClipboardList, UserCheck, Factory, ShieldCheck, Calendar } from "lucide-react";

const services = [
  { icon: Factory, title: "Fabricação Própria", desc: "Desenvolvemos e fabricamos nossos produtos com tecnologia própria, garantindo controle total de qualidade em cada etapa do processo produtivo." },
  { icon: Wrench, title: "Instalação Técnica", desc: "Equipe especializada e treinada conforme as NBRs 9050 e 16537, assegurando execução segura, precisa e em total conformidade técnica." },
  { icon: Search, title: "Consultoria Técnica", desc: "Análise e orientação profissional para projetos de acessibilidade, com conhecimento de quem fabrica e entende cada solução." },
  { icon: ClipboardList, title: "Execução de Projetos", desc: "Planejamento e execução completa — do desenvolvimento à entrega final — com engenharia capacitada e experiência comprovada." },
  { icon: UserCheck, title: "Atendimento Personalizado", desc: "Soluções sob medida para cada projeto, com suporte direto de quem fabrica e domina todo o processo produtivo." },
];

const highlights = [
  { icon: Factory, label: "Indústria Especializada" },
  { icon: ShieldCheck, label: "NBRs 9050 e 16537" },
  { icon: Calendar, label: "+12 Anos de Experiência" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const ServicesSection = () => (
  <section id="servicos" className="section-padding bg-background">
    <div className="container-bethel">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Nossos <span className="text-gradient">Serviços</span>
        </h2>
        <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        <p className="font-body text-muted-foreground text-base md:text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
          Como <span className="text-primary font-semibold">indústria especializada</span> em acessibilidade, a Bethel atua na{" "}
          <span className="text-primary font-semibold">fabricação</span> e fornecimento de soluções com alto padrão de qualidade, além de oferecer{" "}
          <span className="text-primary font-semibold">instalação técnica especializada</span>. Nossa equipe é treinada conforme as{" "}
          <span className="text-primary font-semibold">NBRs 9050 e 16537</span> e conta com{" "}
          <span className="text-primary font-semibold">mais de 12 anos de experiência</span> no ramo, garantindo execução segura, precisa e alinhada às exigências técnicas de cada projeto.
        </p>
      </motion.div>

      {/* Highlight badges */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="flex flex-wrap justify-center gap-4 md:gap-6 mb-14"
      >
        {highlights.map((h) => (
          <motion.div
            key={h.label}
            variants={scaleIn}
            className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-full px-5 py-3"
          >
            <h.icon className="text-primary" size={20} />
            <span className="font-heading text-sm font-bold text-foreground">{h.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s) => (
          <motion.div
            key={s.title}
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card-3d bg-card rounded-xl p-8 border border-border shadow-sm group"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="icon-3d w-14 h-14 gradient-primary rounded-lg flex items-center justify-center mb-6"
            >
              <s.icon className="text-primary-foreground" size={24} />
            </motion.div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">{s.title}</h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ServicesSection;
