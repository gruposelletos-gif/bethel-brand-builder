import { motion } from "framer-motion";
import { Award, Users, ShieldCheck, Clock, Puzzle, Star } from "lucide-react";

const items = [
  { icon: Award, title: "Fabricação Própria", desc: "Produção industrial própria com controle total de qualidade e acabamento." },
  { icon: Users, title: "Atendimento Especializado", desc: "Equipe técnica preparada para entender e atender cada necessidade." },
  { icon: ShieldCheck, title: "Equipe Qualificada", desc: "Profissionais experientes e capacitados em acessibilidade e instalação." },
  { icon: Clock, title: "Compromisso com Prazos", desc: "Entregas pontuais direto da nossa fábrica ao seu projeto." },
  { icon: Puzzle, title: "Soluções Completas", desc: "Da fabricação à instalação — projetos adaptados à realidade de cada cliente." },
  { icon: Star, title: "Confiança e Credibilidade", desc: "Indústria consolidada com reputação construída por resultados." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const DifferentialsSection = () => (
  <section className="section-padding bg-background">
    <div className="container-bethel">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Nossos <span className="text-gradient">diferenciais</span>
        </h2>
        <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card-3d flex gap-4 items-start p-6 rounded-xl bg-card border border-border"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="icon-3d w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <item.icon className="text-primary-foreground" size={22} />
            </motion.div>
            <div>
              <h3 className="font-heading text-base font-bold text-foreground mb-1">{item.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default DifferentialsSection;
