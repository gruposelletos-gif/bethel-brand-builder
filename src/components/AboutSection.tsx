import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";

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

const AboutSection = () => (
  <section id="sobre" className="section-padding bg-background">
    <div className="container-bethel">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="text-center mb-16">
        <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Sobre a <span className="text-gradient">BETHEL</span>
        </motion.h2>
        <motion.div variants={fadeUp} className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        <motion.p variants={fadeUp} className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
          A BETHEL é uma <span className="text-primary font-semibold">indústria</span> especializada na <span className="text-primary font-semibold">fabricação</span>, comercialização e instalação de produtos para acessibilidade. Com <span className="text-primary font-semibold">produção própria</span> e equipe técnica qualificada, entregamos soluções completas — do projeto à execução — com qualidade, segurança e compromisso com cada cliente.
        </motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: "Missão", text: "Fabricar e fornecer soluções em acessibilidade com alto padrão de qualidade, segurança e excelência na entrega." },
          { icon: Eye, title: "Visão", text: "Ser referência nacional como indústria de acessibilidade, reconhecida pela fabricação própria, credibilidade e compromisso." },
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
