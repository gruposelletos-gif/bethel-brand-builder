import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-bethel.png";

const HeroSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Image positioned on the right side only, partially visible */}
      <div className="absolute right-0 top-0 w-[65%] h-full">
        <img
          src={heroBg}
          alt="BETHEL ambiente corporativo acessível"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* White gradient from left to blend with content */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        {/* White gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        {/* Subtle top fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent h-32" />
      </div>

      <div className="relative z-10 container-bethel px-6 lg:px-16 flex flex-col items-start max-w-4xl">
        <motion.img
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          src={logo}
          alt="BETHEL"
          className="h-24 md:h-32 lg:h-40 mb-10 object-contain"
        />
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
        >
          <span className="text-primary">Soluções</span> completas com{" "}
          <span className="text-primary">qualidade</span>,{" "}
          <span className="text-primary">confiança</span> e excelência
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="font-body text-base md:text-lg lg:text-xl text-muted-foreground mt-8 max-w-2xl leading-relaxed"
        >
          A BETHEL atua com venda de produtos e prestação de serviços, oferecendo{" "}
          <span className="text-primary font-semibold">soluções</span> profissionais com foco em{" "}
          <span className="text-primary font-semibold">acessibilidade</span>,{" "}
          <span className="text-primary font-semibold">segurança</span> e atendimento especializado.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <button
            onClick={() => scrollTo("#produtos")}
            className="gradient-primary text-primary-foreground font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            Conheça nossos produtos
          </button>
          <button
            onClick={() => scrollTo("#contato")}
            className="border-2 border-primary text-primary font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary/5 transition-all"
          >
            Fale com nossa equipe
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
