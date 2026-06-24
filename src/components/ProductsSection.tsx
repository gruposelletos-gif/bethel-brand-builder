import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Product, fetchActiveProducts, imageUrl } from "@/lib/products";
import { catalogProducts, catalogAssetMap } from "@/data/catalog-products";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

type DisplayProduct = {
  id: string;
  name: string;
  description: string;
  img: string;
  slug?: string;
};

const fallbackProducts: DisplayProduct[] = catalogProducts.map((p) => ({
  id: p.slug,
  name: p.name,
  description: p.description,
  img: catalogAssetMap[p.imageKey],
  slug: p.slug,
}));

const ProductsSection = () => {
  const [products, setProducts] = useState<DisplayProduct[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveProducts()
      .then((items) => {
        if (items.length > 0) {
          setProducts(
            items.map((p: Product) => ({
              id: p.id,
              name: p.name,
              description: p.description ?? "",
              img: p.images[0] ? imageUrl(p.images[0]) : "",
              slug: p.slug,
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="produtos" className="section-padding bg-muted">
      <div className="container-bethel">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Conheça nossos <span className="text-gradient">produtos</span>
          </h2>
          <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
          <p className="font-body text-muted-foreground text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
            Todos os nossos produtos são desenvolvidos e{" "}
            <span className="text-primary font-semibold">fabricados com tecnologia própria</span>,
            garantindo controle total de qualidade,{" "}
            <span className="text-primary font-semibold">segurança</span> e acabamento de alto padrão.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Carregando produtos...</div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="aspect-square overflow-hidden bg-background flex items-center justify-center p-4">
                  {p.img ? (
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      width={600}
                      height={600}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">Sem imagem</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading text-base font-bold text-foreground mb-2 leading-snug">
                    {p.name}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {p.description}
                  </p>
                  {p.slug ? (
                    <Link
                      to={`/produto/${p.slug}`}
                      className="font-heading text-xs font-bold tracking-wide text-primary hover:text-accent transition-colors self-start"
                    >
                      Ver detalhes →
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollTo("#contato")}
                      className="font-heading text-xs font-bold tracking-wide text-primary hover:text-accent transition-colors self-start"
                    >
                      Solicitar orçamento →
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
