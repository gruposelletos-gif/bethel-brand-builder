import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Category, Product, fetchAllProducts, fetchCategories, imageUrl } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const load = async () => {
    const [p, c] = await Promise.all([fetchAllProducts(), fetchCategories()]);
    setProducts(p);
    setCats(c);
  };

  useEffect(() => { load(); }, []);

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", toDelete.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Produto excluído" });
      setToDelete(null);
      load();
    }
  };

  const filtered = filter === "all" ? products : products.filter((p) => p.category_id === filter);
  const catName = (id: string | null) => cats.find((c) => c.id === id)?.name ?? "—";

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo do site</p>
        </div>
        <Button asChild>
          <Link to="/admin/produtos/novo"><Plus size={16} /> Novo produto</Link>
        </Button>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-input rounded-md px-3 py-2 bg-background text-sm"
        >
          <option value="all">Todas as categorias</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum produto cadastrado.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                  {p.images[0] && (
                    <img src={imageUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{p.name}</h3>
                    {!p.active && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Inativo</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{catName(p.category_id)}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/admin/produtos/${p.id}`}><Pencil size={14} /></Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setToDelete(p)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto "{toDelete?.name}" será removido.
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
