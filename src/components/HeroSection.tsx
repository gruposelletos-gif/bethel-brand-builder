import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-bethel.jpg";

const HeroSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="BETHEL ambiente corporativo"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 gradient-overlay" />

      <div className="relative z-10 container-bethel px-4 lg:px-16 text-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={logo}
          alt="BETHEL"
          className="h-24 md:h-32 mx-auto mb-8 rounded-xl bg-primary-foreground/90 p-2"
        />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto"
        >
          Soluções completas com qualidade, confiança e excelência
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-lg md:text-xl text-primary-foreground/85 mt-6 max-w-3xl mx-auto leading-relaxed"
        >
          A BETHEL atua com venda de produtos e prestação de serviços, oferecendo soluções profissionais com foco em qualidade, eficiência e atendimento especializado.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <button
            onClick={() => scrollTo("#produtos")}
            className="bg-primary-foreground text-primary font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary-foreground/90 transition-all shadow-lg"
          >
            Conheça nossos produtos
          </button>
          <button
            onClick={() => scrollTo("#contato")}
            className="border-2 border-primary-foreground text-primary-foreground font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary-foreground/10 transition-all"
          >
            Fale com nossa equipe
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
