import { motion } from "framer-motion";
import produtoAssento from "@/assets/produto-assento-articulado.jpg";
import produtoBarraU from "@/assets/produto-barra-u.jpg";
import produtoBarraReta1 from "@/assets/produto-barra-reta-1.jpg";
import produtoBarraReta2 from "@/assets/produto-barra-reta-2.jpg";
import produtoAlarme from "@/assets/produto-alarme-pcd.jpg";
import produtoChapa from "@/assets/produto-chapa-inox.jpg";
import produtoPlaca from "@/assets/produto-placa-inox-1.jpg";
import produtoPisoAlerta from "@/assets/produto-piso-tatil-alerta.jpg";
import produtoPisoDirecionalAlerta from "@/assets/produto-piso-tatil-direcional-alerta.jpg";
import produtoPisoDirecional from "@/assets/produto-piso-tatil-direcional.jpg";
import produtoAcabamentoInox from "@/assets/produto-placa-inox-2.jpg";
import produtoPlacaBraille from "@/assets/produto-placa-braille-pne.jpg";
import produtoPlacaFeminino from "@/assets/produto-placa-sanitario-feminino.jpg";
import produtoPlacaMasculino from "@/assets/produto-placa-sanitario-masculino.jpg";
import produtoPlacaPuxeEmpurre from "@/assets/produto-placa-puxe-empurre.jpg";
import produtoFitaSinalizacao from "@/assets/produto-fita-fotoluminescente-sinalizacao.jpg";
import produtoFitaFotoluminescente from "@/assets/produto-fita-fotoluminescente.jpg";
import produtoFitaAdesiva from "@/assets/produto-fita-fotoluminescente-adesiva.jpg";

const products = [
  {
    img: produtoAssento,
    name: "Banco Articulado 70x45",
    desc: "Assento articulado em inox desenvolvido para proporcionar mais segurança, acessibilidade e conforto em ambientes adaptados. Ideal para banheiros acessíveis, oferece resistência, durabilidade e excelente acabamento.",
  },
  {
    img: produtoBarraU,
    name: "Suporte Lateral de Lavatório",
    desc: "Barra de apoio em formato \"U\", fabricada para oferecer maior estabilidade, apoio e segurança ao usuário. Indicada para banheiros acessíveis e espaços adaptados, com estrutura resistente e acabamento de alta qualidade.",
  },
  {
    img: produtoBarraReta1,
    name: "Barra Reta de Apoio",
    desc: "Barra de apoio reta produzida com alta resistência e excelente acabamento. Indicada para auxiliar na mobilidade e dar mais segurança em áreas acessíveis, atendendo diferentes necessidades de instalação.",
  },
  {
    img: produtoAlarme,
    name: "Elemento Tátil PVC",
    desc: "Elemento Tátil em PVC, leve e resistente, ideal para garantir acessibilidade com ótimo custo-benefício. Fácil de instalar, possui boa durabilidade e proporciona orientação segura em diversos ambientes.",
  },
  {
    img: produtoChapa,
    name: "Elemento Tátil Inox Adesivado",
    desc: "Elemento Tátil em inox adesivado, prático e de fácil instalação, ideal para garantir acessibilidade sem necessidade de perfuração. Resistente e com acabamento moderno, oferece ótima aderência e durabilidade para uso em diversos ambientes.",
  },
  {
    img: produtoPlaca,
    name: "Elemento Tátil Inox",
    desc: "Elemento Tátil em inox de alta durabilidade, ideal para garantir acessibilidade e segurança em ambientes internos e externos. Resistente à corrosão, possui acabamento moderno e excelente fixação, proporcionando orientação eficiente e longa vida útil.",
  },
  {
    img: produtoPisoAlerta,
    name: "Piso Tátil de Alerta",
    desc: "Piso tátil de alerta desenvolvido para sinalização de atenção e mudança de condição no percurso, contribuindo para a orientação e segurança de pessoas com deficiência visual. Fabricado com alta resistência, durabilidade e excelente acabamento.",
  },
  {
    img: produtoPisoDirecionalAlerta,
    name: "Piso Tátil Concreto",
    desc: "Piso tátil em concreto, robusto e altamente resistente, ideal para áreas externas. Garante acessibilidade com segurança, suportando alto fluxo e variações climáticas com excelente durabilidade.",
  },
  {
    img: produtoAcabamentoInox,
    name: "Acabamento / Proteção Inox",
    desc: "Peça de acabamento em inox desenvolvida para proteção, fixação e composição técnica em ambientes acessíveis. Fabricada com material resistente, excelente acabamento e visual profissional.",
  },
  {
    img: produtoPisoDirecional,
    name: "Piso Tátil Direcional",
    desc: "Piso tátil direcional fabricado para conduzir e orientar o deslocamento seguro de pessoas com deficiência visual em ambientes públicos e privados. Produto resistente, funcional e desenvolvido conforme a necessidade de projetos acessíveis.",
  },
  {
    img: produtoPlacaBraille,
    name: "Placa em Braille – Sanitário PNE / Unissex",
    desc: "Placa de sinalização em braille para sanitário PNE e unissex, produzida para garantir identificação acessível, leitura tátil e comunicação inclusiva em ambientes adaptados. Produto com acabamento profissional e excelente legibilidade.",
  },
  {
    img: produtoPlacaFeminino,
    name: "Placa de Sinalização Acessível – Sanitário Feminino",
    desc: "Placa de sinalização acessível para sanitário feminino, com texto, pictograma e braille. Desenvolvida para proporcionar identificação clara, acessível e padronizada em ambientes públicos e privados.",
  },
  {
    img: produtoPlacaMasculino,
    name: "Placa de Sinalização Acessível – Sanitário Masculino",
    desc: "Placa de sinalização acessível para sanitário masculino, com texto, pictograma e braille. Produto ideal para compor projetos de acessibilidade com qualidade, organização visual e conformidade técnica.",
  },
  {
    img: produtoPlacaPuxeEmpurre,
    name: 'Placa Tátil "Puxe / Empurre"',
    desc: "Placa tátil indicativa \"Puxe / Empurre\", produzida para melhorar a comunicação acessível em portas e acessos. Conta com informação visual e braille, oferecendo mais autonomia, orientação e funcionalidade ao usuário.",
  },
  {
    img: produtoFitaSinalizacao,
    name: "Fita Fotoluminescente de Sinalização",
    desc: "Fita fotoluminescente desenvolvida para sinalização visual em ambientes internos, auxiliando na orientação e identificação de rotas e áreas de circulação. Produto funcional, resistente e ideal para projetos que exigem segurança e acessibilidade.",
  },
  {
    img: produtoFitaFotoluminescente,
    name: "Fita Fotoluminescente",
    desc: "Solução fotoluminescente produzida para ampliar a visibilidade em ambientes com baixa iluminação, contribuindo para sinalização de rotas, degraus, acessos e áreas estratégicas. Produto prático, durável e de fácil aplicação.",
  },
  {
    img: produtoFitaAdesiva,
    name: "Fita Fotoluminescente Adesiva",
    desc: "Fita fotoluminescente adesiva fabricada com excelente aderência e acabamento, ideal para aplicações em sinalização de segurança e acessibilidade. Desenvolvida para oferecer melhor orientação visual e reforçar a segurança dos espaços.",
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
