import { motion } from "framer-motion";
import produtoAssento from "@/assets/produto-assento-articulado.jpg";
import produtoBarraU from "@/assets/produto-barra-u.jpg";
import produtoBarraReta1 from "@/assets/produto-barra-reta-1.jpg";
import produtoBarraReta2 from "@/assets/produto-barra-reta-2.jpg";
import produtoAlarme from "@/assets/produto-alarme-pcd.jpg";
import produtoChapa from "@/assets/produto-chapa-inox.jpg";
import produtoPlaca from "@/assets/produto-placa-inox-1.jpg";

const products = [
  {
    img: produtoAssento,
    name: "Assento Articulado Inox",
    desc: "Assento articulado em inox desenvolvido para proporcionar mais segurança, acessibilidade e conforto em ambientes adaptados. Ideal para banheiros acessíveis, oferece resistência, durabilidade e excelente acabamento.",
  },
  {
    img: produtoBarraU,
    name: 'Barra de Apoio em "U"',
    desc: "Barra de apoio em formato \"U\", fabricada para oferecer maior estabilidade, apoio e segurança ao usuário. Indicada para banheiros acessíveis e espaços adaptados, com estrutura resistente e acabamento de alta qualidade.",
  },
  {
    img: produtoBarraReta1,
    name: "Barra de Apoio Reta",
    desc: "Barra de apoio reta produzida com alta resistência e excelente acabamento. Indicada para auxiliar na mobilidade e dar mais segurança em áreas acessíveis, atendendo diferentes necessidades de instalação.",
  },
  {
    img: produtoBarraReta2,
    name: "Barra de Apoio Reta",
    desc: "Barra de apoio reta fabricada para oferecer apoio seguro, resistência e durabilidade. Solução ideal para projetos de acessibilidade, com visual técnico, acabamento profissional e aplicação versátil.",
  },
  {
    img: produtoAlarme,
    name: "Alarme PCD",
    desc: "Alarme PCD desenvolvido para reforçar a segurança e a acessibilidade em sanitários e ambientes adaptados. Produto prático, funcional e essencial para espaços que exigem atendimento às normas de acessibilidade.",
  },
  {
    img: produtoChapa,
    name: "Chapa Inox para Acabamento / Proteção",
    desc: "Chapa em inox para acabamento e proteção, desenvolvida para compor ambientes com mais resistência, durabilidade e padrão estético profissional. Ideal para aplicações que exigem robustez e acabamento técnico.",
  },
  {
    img: produtoPlaca,
    name: "Placa / Acabamento Inox",
    desc: "Placa de acabamento em inox produzida com excelente qualidade e acabamento refinado. Indicada para compor soluções de acessibilidade com visual limpo, resistente e profissional.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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
            Todos os nossos produtos são desenvolvidos e <span className="text-primary font-semibold">fabricados com tecnologia própria</span>, garantindo controle total de qualidade, <span className="text-primary font-semibold">segurança</span> e acabamento de alto padrão.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((p, idx) => (
            <motion.div
              key={`${p.name}-${idx}`}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-background flex items-center justify-center p-4">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading text-base font-bold text-foreground mb-2 leading-snug">{p.name}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{p.desc}</p>
                <button
                  onClick={() => scrollTo("#contato")}
                  className="font-heading text-xs font-bold tracking-wide text-primary hover:text-accent transition-colors self-start"
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
