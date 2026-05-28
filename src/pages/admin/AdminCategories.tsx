import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, fetchCategories, slugify } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const AdminCategories = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", mega_column: "" });

  const load = () => fetchCategories().then(setCats);
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("categories").insert({
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      mega_column: form.mega_column.trim() || null,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setForm({ name: "", slug: "", mega_column: "" });
    toast({ title: "Categoria criada" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir esta categoria? Produtos vinculados ficarão sem categoria.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Categorias</h1>

      <form onSubmit={add} className="bg-card border border-border rounded-lg p-4 mb-6 grid gap-3 md:grid-cols-4 md:items-end">
        <div>
          <Label htmlFor="cn">Nome *</Label>
          <Input id="cn" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} />
        </div>
        <div>
          <Label htmlFor="cs">Slug</Label>
          <Input id="cs" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
        </div>
        <div>
          <Label htmlFor="cm">Coluna do menu</Label>
          <Input id="cm" value={form.mega_column} onChange={(e) => setForm({ ...form, mega_column: e.target.value })} placeholder="Ex: Linha Acessibilidade" />
        </div>
        <Button type="submit"><Plus size={16} /> Adicionar</Button>
      </form>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {cats.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between gap-2">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">/{c.slug}{c.mega_column ? ` · ${c.mega_column}` : ""}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => remove(c.id)}><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
