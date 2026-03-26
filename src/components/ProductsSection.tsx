import { motion } from "framer-motion";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  { img: product1, name: "Barras de Apoio", desc: "Barras em aço inox para segurança e acessibilidade em ambientes internos." },
  { img: product2, name: "Piso Tátil", desc: "Pisos direcionais e de alerta para orientação de pessoas com deficiência visual." },
  { img: product3, name: "Rampas de Acesso", desc: "Rampas portáteis e fixas em alumínio para acessibilidade em diversos ambientes." },
  { img: product4, name: "Puxadores Acessíveis", desc: "Puxadores e maçanetas com design universal para portas e mobiliário." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const ProductsSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="produtos" className="section-padding bg-muted">
      <div className="container-bethel">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Conheça nossos <span className="text-gradient">produtos</span>
          </h2>
          <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
          <p className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
            Trabalhamos com produtos de <span className="text-primary font-semibold">qualidade</span>, selecionados para atender diferentes demandas com eficiência, <span className="text-primary font-semibold">segurança</span> e excelente acabamento.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <motion.div
              key={p.name}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-square overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" width={600} height={600} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{p.name}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">{p.desc}</p>
                <button
                  onClick={() => scrollTo("#contato")}
                  className="font-heading text-xs font-bold tracking-wide text-primary hover:text-accent transition-colors"
                >
                  Solicitar orçamento →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
