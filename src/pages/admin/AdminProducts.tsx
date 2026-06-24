import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import ProductPreview from "@/components/admin/ProductPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  Package,
  Tags,
  Layers,
} from "lucide-react";
import {
  Category,
  Product,
  fetchAllProducts,
  fetchCategories,
  imageUrl,
  importCatalogProducts,
} from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const searchId = useId();
  const filterId = useId();
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([fetchAllProducts(), fetchCategories()]);
    setProducts(p);
    setCats(c);

    if (p.length === 0) {
      setImporting(true);
      try {
        const result = await importCatalogProducts();
        if (result.inserted > 0) {
          const refreshed = await fetchAllProducts();
          setProducts(refreshed);
          toast({
            title: "Catálogo sincronizado",
            description: `${result.inserted} produtos importados do site para o painel.`,
          });
          queryClient.invalidateQueries({ queryKey: ["mega-menu"] });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        toast({ title: "Erro ao importar catálogo", description: message, variant: "destructive" });
      } finally {
        setImporting(false);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", toDelete.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Produto excluído" });
      setToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["mega-menu"] });
      load();
    }
  };

  const catName = (id: string | null) => cats.find((c) => c.id === id)?.name ?? "—";

  const filtered = products
    .filter((p) => (filter === "all" ? true : p.category_id === filter))
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        catName(p.category_id).toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.sort_order - b.sort_order);

  const activeCount = products.filter((p) => p.active).length;
  const inactiveCount = products.length - activeCount;

  const stats = [
    { label: "Total", value: products.length, icon: Package },
    { label: "Ativos", value: activeCount, icon: Eye },
    { label: "Inativos", value: inactiveCount, icon: Layers },
    { label: "Categorias", value: cats.length, icon: Tags },
  ];

  return (
    <AdminLayout>
      <header className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
              Catálogo
            </p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-balance">
              Produtos
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5 max-w-xl text-pretty">
              Cadastre, edite e visualize como cada produto aparece no site.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 touch-manipulation">
            <Link to="/admin/produtos/novo">
              <Plus size={16} aria-hidden="true" /> Novo Produto
            </Link>
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card px-4 py-3.5 flex items-center gap-3 shadow-sm"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                  {label}
                </dt>
                <dd className="font-heading text-2xl font-bold tabular-nums leading-none mt-1">
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative flex-1 min-w-0">
              <Label htmlFor={searchId} className="mb-1.5 block">
                Buscar
              </Label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id={searchId}
                  name="product-search"
                  type="search"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Nome, slug ou categoria…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-56 shrink-0">
              <Label htmlFor={filterId} className="mb-1.5 block">
                Categoria
              </Label>
              <select
                id={filterId}
                name="category-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">Todas as categorias</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {search.trim() || filter !== "all" ? (
            <p className="mt-3 text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {filtered.length} de {products.length} produtos
            </p>
          ) : null}
        </div>
      </header>

      {importing ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-border bg-card py-16 px-6 text-center"
        >
          <p className="text-muted-foreground">Importando produtos do catálogo…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-16 px-6 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted"
            aria-hidden="true"
          >
            <Package size={24} className="text-muted-foreground" />
          </div>
          <h2 className="font-heading text-lg font-semibold mb-2 text-balance">
            {products.length === 0 ? "Nenhum produto cadastrado" : "Nenhum resultado"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto text-pretty">
            {products.length === 0
              ? "Comece cadastrando seu primeiro produto com texto, imagens e posição na listagem."
              : "Tente outro termo de busca ou categoria."}
          </p>
          {products.length === 0 && (
            <Button asChild>
              <Link to="/admin/produtos/novo">
                <Plus size={16} aria-hidden="true" /> Cadastrar Primeiro Produto
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 list-none p-0 m-0">
          {filtered.map((p) => {
            const category = catName(p.category_id);
            const cover = p.images[0] ? imageUrl(p.images[0]) : null;

            return (
              <li key={p.id}>
                <article
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
                    "motion-safe:transition-[box-shadow,border-color,transform] motion-safe:duration-300",
                    "motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/25 motion-safe:hover:shadow-lg"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/80 to-muted/30">
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        width={400}
                        height={300}
                        loading="lazy"
                        className="h-full w-full object-contain p-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                    {!p.active && (
                      <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
                        Inativo
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary truncate">
                      {category}
                    </p>
                    <h2 className="font-heading mt-1 text-base font-bold leading-snug text-balance line-clamp-2">
                      {p.name}
                    </h2>
                    {p.description ? (
                      <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2 text-pretty">
                        {p.description}
                      </p>
                    ) : (
                      <p className="mt-2 flex-1 text-sm text-muted-foreground/50 italic">
                        Sem descrição
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] font-normal tabular-nums">
                        Pos. {p.sort_order}
                      </Badge>
                      {p.images.length > 0 && (
                        <Badge variant="outline" className="text-[10px] font-normal tabular-nums">
                          {p.images.length} {p.images.length === 1 ? "foto" : "fotos"}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-border/60 pt-4">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="flex-1 touch-manipulation"
                        onClick={() => setPreviewProduct(p)}
                      >
                        <Eye size={14} aria-hidden="true" /> Ver Página
                      </Button>
                      <Button asChild size="sm" variant="outline" className="touch-manipulation">
                        <Link to={`/admin/produtos/${p.id}`} aria-label={`Editar ${p.name}`}>
                          <Pencil size={14} aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="touch-manipulation text-destructive hover:text-destructive"
                        onClick={() => setToDelete(p)}
                        aria-label={`Excluir ${p.name}`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet open={!!previewProduct} onOpenChange={(open) => !open && setPreviewProduct(null)}>
        <SheetContent className="w-full overflow-y-auto overscroll-contain sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-heading text-balance">Pré-visualização Completa</SheetTitle>
            <SheetDescription className="text-pretty">
              Como o visitante verá a página do produto no site.
            </SheetDescription>
          </SheetHeader>
          {previewProduct && (
            <div className="mt-6">
              <ProductPreview
                data={{
                  name: previewProduct.name,
                  description: previewProduct.description ?? "",
                  tech_info: previewProduct.tech_info ?? "",
                  images: previewProduct.images,
                  categoryName: catName(previewProduct.category_id),
                  active: previewProduct.active,
                  sort_order: previewProduct.sort_order,
                }}
                defaultMode="detail"
                showModeToggle
              />
              <div className="mt-4 flex gap-2">
                <Button asChild className="flex-1 touch-manipulation">
                  <Link to={`/admin/produtos/${previewProduct.id}`}>
                    <Pencil size={14} aria-hidden="true" /> Editar Produto
                  </Link>
                </Button>
                {previewProduct.active && (
                  <Button asChild variant="outline" className="flex-1 touch-manipulation">
                    <a
                      href={`/produto/${previewProduct.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir no Site
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription className="text-pretty">
              Esta ação não pode ser desfeita. O produto &ldquo;{toDelete?.name}&rdquo; será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminProducts;
