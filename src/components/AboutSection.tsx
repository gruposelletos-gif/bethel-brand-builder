import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";

const values = ["Compromisso", "Qualidade", "Ética", "Inovação", "Responsabilidade", "Respeito ao cliente"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const AboutSection = () => (
  <section id="sobre" className="section-padding bg-background">
    <div className="container-bethel">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-16">
        <motion.h2 variants={fadeUp} custom={0} className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Sobre a <span className="text-gradient">BETHEL</span>
        </motion.h2>
        <motion.div variants={fadeUp} custom={1} className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        <motion.p variants={fadeUp} custom={2} className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
          A BETHEL é uma empresa comprometida com qualidade, inovação e excelência no atendimento. Atuamos com fornecimento de produtos e prestação de serviços, sempre buscando entregar soluções eficientes, seguras e personalizadas para cada cliente.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: "Missão", text: "Oferecer produtos e serviços com alto padrão de qualidade, gerando confiança e resultados." },
          { icon: Eye, title: "Visão", text: "Ser referência no mercado pela excelência, credibilidade e compromisso com o cliente." },
          { icon: Heart, title: "Valores", text: values.join(" · ") },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <item.icon className="text-primary-foreground" size={28} />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">{item.title}</h3>
            <p className="font-body text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
