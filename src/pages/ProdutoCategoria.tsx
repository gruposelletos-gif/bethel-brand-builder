import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Category, Product, fetchProductsByCategory, imageUrl } from "@/lib/products";

const ProdutoCategoria = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Pick<Category, "id" | "name" | "slug" | "mega_column"> | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductsByCategory(slug).then(({ category, products }) => {
      setCategory(category as any);
      setProducts(products);
      setLoading(false);
    });
  }, [slug]);

  if (!loading && !category) {
    return (
      <PageLayout>
        <div className="container-bethel px-4 lg:px-8 py-24 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Categoria não encontrada</h1>
          <Link to="/produtos" className="text-primary hover:underline">Ver todos os produtos</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-navy to-primary text-white py-16 md:py-24">
        <div className="container-bethel px-4 lg:px-8">
          {category?.mega_column && (
            <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70 mb-3">
              {category.mega_column}
            </p>
          )}
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{category?.name ?? "..."}</h1>
          <p className="font-body text-base md:text-lg text-white/85 max-w-2xl">
            Conheça nossa linha de <strong>{category?.name.toLowerCase()}</strong> — produtos
            desenvolvidos em conformidade com as normas NBR 9050 e NBR 16537, garantindo
            acessibilidade, segurança e durabilidade.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container-bethel px-4 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando produtos...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum produto cadastrado nesta categoria ainda.</p>
              <Link to="/contato" className="text-primary hover:underline font-medium">
                Entre em contato para mais informações
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/produto/${p.slug}`}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    {p.images[0] ? (
                      <img
                        src={imageUrl(p.images[0])}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default ProdutoCategoria;
