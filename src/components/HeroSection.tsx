import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-bethel.png";

const HeroSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Image positioned on the right side */}
      <div className="absolute right-0 top-0 w-[60%] h-full">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroBg}
          alt="BETHEL ambiente corporativo acessível"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-transparent h-24" />
      </div>

      {/* Content - pushed more to the left */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="max-w-2xl">
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 gradient-primary rounded-full mb-8"
          />

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
          >
            <span className="text-primary">Soluções</span> completas com{" "}
            <span className="text-primary">qualidade</span>,{" "}
            <span className="text-primary">confiança</span> e excelência
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-body text-base md:text-lg lg:text-xl text-muted-foreground mt-6 max-w-xl leading-relaxed"
          >
            A BETHEL atua com venda de produtos e prestação de serviços, oferecendo{" "}
            <span className="text-primary font-semibold">soluções</span> profissionais com foco em{" "}
            <span className="text-primary font-semibold">acessibilidade</span>,{" "}
            <span className="text-primary font-semibold">segurança</span> e atendimento especializado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <button
              onClick={() => scrollTo("#produtos")}
              className="btn-3d gradient-primary text-primary-foreground font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
            >
              Conheça nossos produtos
            </button>
            <button
              onClick={() => scrollTo("#contato")}
              className="btn-3d border-2 border-primary text-primary font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary/5 transition-all active:scale-[0.98]"
            >
              Fale com nossa equipe
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
