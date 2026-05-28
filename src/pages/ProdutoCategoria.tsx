import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProductsSection from "@/components/ProductsSection";
import { allCategories, megaColumns } from "@/lib/navigation";

const ProdutoCategoria = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = allCategories.find((c) => c.slug === slug);
  const parent = megaColumns.find((col) => col.items.some((i) => i.slug === slug));

  if (!category) {
    return (
      <PageLayout>
        <div className="container-bethel px-4 lg:px-8 py-24 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Categoria não encontrada
          </h1>
          <Link to="/produtos" className="text-primary hover:underline">
            Ver todos os produtos
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-navy to-primary text-white py-16 md:py-24">
        <div className="container-bethel px-4 lg:px-8">
          {parent && (
            <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70 mb-3">
              {parent.title}
            </p>
          )}
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{category.label}</h1>
          <p className="font-body text-base md:text-lg text-white/85 max-w-2xl">
            Conheça nossa linha de <strong>{category.label.toLowerCase()}</strong> — produtos
            desenvolvidos em conformidade com as normas NBR 9050 e NBR 16537, garantindo
            acessibilidade, segurança e durabilidade.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#produtos"
              className="inline-flex items-center px-6 py-3 rounded-md bg-white text-primary font-heading text-sm font-semibold hover:bg-white/90 transition"
            >
              Solicitar orçamento
            </a>
            <Link
              to="/produtos"
              className="inline-flex items-center px-6 py-3 rounded-md border border-white/30 text-white font-heading text-sm font-semibold hover:bg-white/10 transition"
            >
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      <ProductsSection />
    </PageLayout>
  );
};

export default ProdutoCategoria;
