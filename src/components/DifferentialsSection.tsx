import { motion } from "framer-motion";
import { Award, Users, ShieldCheck, Clock, Puzzle, Star } from "lucide-react";

const items = [
  { icon: Award, title: "Qualidade nos Produtos", desc: "Produtos selecionados com rigoroso controle de qualidade." },
  { icon: Users, title: "Atendimento Especializado", desc: "Equipe preparada para entender e atender cada necessidade." },
  { icon: ShieldCheck, title: "Equipe Qualificada", desc: "Profissionais experientes e capacitados em acessibilidade." },
  { icon: Clock, title: "Compromisso com Prazos", desc: "Entregas pontuais e cumprimento de cronogramas." },
  { icon: Puzzle, title: "Soluções Personalizadas", desc: "Projetos adaptados à realidade de cada cliente." },
  { icon: Star, title: "Confiança e Credibilidade", desc: "Reputação construída com transparência e resultados." },
];

const DifferentialsSection = () => (
  <section className="section-padding bg-background">
    <div className="container-bethel">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Nossos <span className="text-gradient">diferenciais</span>
        </h2>
        <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex gap-4 items-start p-6 rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon className="text-primary-foreground" size={22} />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-foreground mb-1">{item.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DifferentialsSection;
