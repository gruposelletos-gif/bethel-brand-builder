import { motion } from "framer-motion";
import { Target, Eye, Heart, Factory, HardHat, ShieldCheck } from "lucide-react";

const values = ["Compromisso", "Qualidade", "Ética", "Inovação", "Responsabilidade", "Respeito ao cliente"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const highlights = [
  { icon: Factory, label: "Fabricação Própria" },
  { icon: HardHat, label: "Engenharia Capacitada" },
  { icon: ShieldCheck, label: "Normas NBR 9050 e 16537" },
];

const AboutSection = () => (
  <section id="sobre" className="section-padding bg-background">
    <div className="container-bethel">
      {/* Header */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="text-center mb-12">
        <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Sobre a <span className="text-gradient">Bethel Acessibilidade</span>
        </motion.h2>
        <motion.div variants={fadeUp} className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* Institutional text — split into 2 blocks */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="max-w-4xl mx-auto mb-16 space-y-6"
      >
        <motion.p variants={fadeUp} className="font-body text-muted-foreground text-base md:text-lg leading-relaxed text-center">
          A Bethel Acessibilidade é uma{" "}
          <span className="text-primary font-semibold">indústria especializada</span> no desenvolvimento e{" "}
          <span className="text-primary font-semibold">fabricação</span> de soluções para pessoas com deficiência.
          Com um portfólio completo que abrange desde o desenvolvimento de projetos com{" "}
          <span className="text-primary font-semibold">equipe de engenharia capacitada</span>, até produtos como pisos táteis,
          barras de apoio, alarme PCD, dentre outros, além de{" "}
          <span className="text-primary font-semibold">instalação técnica</span>, nossa missão é garantir que espaços
          públicos e privados sejam acessíveis para todos.
        </motion.p>

        <motion.p variants={fadeUp} className="font-body text-muted-foreground text-base md:text-lg leading-relaxed text-center">
          Nossos produtos são rigorosamente fabricados seguindo as diretrizes das{" "}
          <span className="text-primary font-semibold">NBRs 9050 e 16537</span>, unindo durabilidade e precisão técnica.
          Na Bethel, acreditamos que a{" "}
          <span className="text-primary font-semibold">acessibilidade</span> não é apenas uma exigência legal, mas um padrão
          de qualidade que valoriza qualquer empreendimento e respeita a autonomia do cidadão.
        </motion.p>
      </motion.div>

      {/* Highlight badges */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16"
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

      {/* Mission / Vision / Values cards */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: "Missão", text: "Fabricar e fornecer soluções em acessibilidade com alto padrão de qualidade, segurança e excelência — do projeto à instalação." },
          { icon: Eye, title: "Visão", text: "Ser referência nacional como indústria de acessibilidade, reconhecida pela fabricação própria, inovação técnica e compromisso com a inclusão." },
          { icon: Heart, title: "Valores", text: values.join(" · ") },
        ].map((item) => (
          <motion.div
            key={item.title}
            variants={scaleIn}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="card-3d bg-card rounded-xl p-8 border border-border shadow-sm text-center"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="icon-3d w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <item.icon className="text-primary-foreground" size={28} />
            </motion.div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">{item.title}</h3>
            <p className="font-body text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
