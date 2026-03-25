import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const CtaSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-padding gradient-primary">
      <div className="container-bethel text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground max-w-3xl mx-auto"
        >
          Precisa de produtos ou serviços com qualidade e confiança?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-body text-primary-foreground/85 text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
        >
          Entre em contato com nossa equipe e solicite um orçamento personalizado.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <button
            onClick={() => scrollTo("#contato")}
            className="bg-primary-foreground text-primary font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary-foreground/90 transition-all shadow-lg"
          >
            Solicitar orçamento
          </button>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-primary-foreground text-primary-foreground font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary-foreground/10 transition-all inline-flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Falar no WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
