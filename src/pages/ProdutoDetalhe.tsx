import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProductQuoteForm from "@/components/products/ProductQuoteForm";
import { Product, fetchProductBySlug, imageUrl, fetchCategories, Category } from "@/lib/products";
import { Button } from "@/components/ui/button";

const ProdutoDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([fetchProductBySlug(slug), fetchCategories()]).then(([p, c]) => {
      setProduct(p);
      setCats(c);
      setSelected(0);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <PageLayout><div className="container-bethel py-24 text-center text-muted-foreground">Carregando...</div></PageLayout>;
  }
  if (!product) {
    return (
      <PageLayout>
        <div className="container-bethel py-24 text-center">
          <h1 className="font-heading text-3xl font-bold mb-3">Produto não encontrado</h1>
          <Link to="/produtos" className="text-primary hover:underline">Ver catálogo</Link>
        </div>
      </PageLayout>
    );
  }

  const category = cats.find((c) => c.id === product.category_id);
  const whatsappMsg = encodeURIComponent(`Olá, gostaria de mais informações sobre o produto: ${product.name}`);

  return (
    <PageLayout>
      <div className="container-bethel px-4 lg:px-8 py-8 md:py-12">
        <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-foreground">Produtos</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/produtos/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
              {product.images[selected] ? (
                <img src={imageUrl(product.images[selected])} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((path, i) => (
                  <button
                    key={path}
                    onClick={() => setSelected(i)}
                    className={`aspect-square rounded overflow-hidden border-2 transition ${
                      i === selected ? "border-primary" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={imageUrl(path)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {category && (
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">{category.name}</p>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            {product.description && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">{product.description}</p>
            )}
            {product.tech_info && (
              <div className="mb-6">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-2">Informações técnicas</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{product.tech_info}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                  Solicitar orçamento
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contato">Falar com vendas</Link>
              </Button>
            </div>
          </div>
        </div>

        <ProductQuoteForm productSlug={product.slug} productName={product.name} />
      </div>
    </PageLayout>
  );
};

export default ProdutoDetalhe;
