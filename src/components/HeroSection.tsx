import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-bethel.png";

const HeroSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="BETHEL ambiente corporativo acessível"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Softer gradient overlay with lower opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsla(210,50%,10%,0.55)] via-[hsla(200,85%,28%,0.40)] to-[hsla(210,50%,10%,0.65)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsla(210,50%,10%,0.30)] to-transparent" />

      <div className="relative z-10 container-bethel px-6 lg:px-16 text-center flex flex-col items-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          src={logo}
          alt="BETHEL"
          className="h-28 md:h-36 lg:h-44 mx-auto mb-10 rounded-xl bg-primary-foreground/95 p-4 shadow-xl"
        />
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-4xl drop-shadow-lg"
        >
          Soluções completas com qualidade, confiança e excelência
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="font-body text-base md:text-lg lg:text-xl text-primary-foreground/90 mt-8 max-w-2xl leading-relaxed drop-shadow-sm"
        >
          A BETHEL atua com venda de produtos e prestação de serviços, oferecendo soluções profissionais com foco em qualidade, eficiência e atendimento especializado.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <button
            onClick={() => scrollTo("#produtos")}
            className="bg-primary-foreground text-primary font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary-foreground/90 transition-all shadow-lg hover:shadow-xl"
          >
            Conheça nossos produtos
          </button>
          <button
            onClick={() => scrollTo("#contato")}
            className="border-2 border-primary-foreground/80 text-primary-foreground font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-lg hover:bg-primary-foreground/10 transition-all backdrop-blur-sm"
          >
            Fale com nossa equipe
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
