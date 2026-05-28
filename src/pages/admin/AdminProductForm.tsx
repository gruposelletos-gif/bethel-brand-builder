import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Category, fetchCategories, imageUrl, slugify } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X } from "lucide-react";

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [cats, setCats] = useState<Category[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    description: "",
    tech_info: "",
    active: true,
    images: [] as string[],
  });

  useEffect(() => {
    fetchCategories().then(setCats);
    if (isEdit) {
      supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
        if (data) {
          setForm({
            name: data.name,
            slug: data.slug,
            category_id: data.category_id ?? "",
            description: data.description ?? "",
            tech_info: data.tech_info ?? "",
            active: data.active,
            images: Array.isArray(data.images) ? (data.images as string[]) : [],
          });
        }
      });
    }
  }, [id, isEdit]);

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("product-images").upload(path, file);
        if (error) throw error;
        uploaded.push(path);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
      toast({ title: "Imagens enviadas" });
    } catch (err: any) {
      toast({ title: "Erro no upload", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = async (path: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((p) => p !== path) }));
    if (!path.startsWith("http")) {
      await supabase.storage.from("product-images").remove([path]);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      category_id: form.category_id || null,
      description: form.description.trim() || null,
      tech_info: form.tech_info.trim() || null,
      active: form.active,
      images: form.images,
    };
    const res = isEdit
      ? await supabase.from("products").update(payload).eq("id", id!)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (res.error) {
      toast({ title: "Erro", description: res.error.message, variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Produto atualizado" : "Produto criado" });
    navigate("/admin/produtos");
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link to="/admin/produtos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mt-2">
          {isEdit ? "Editar produto" : "Novo produto"}
        </h1>
      </div>

      <form onSubmit={submit} className="grid gap-6 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome do produto *</Label>
            <Input id="name" required value={form.name} onChange={(e) => {
              update("name", e.target.value);
              if (!isEdit) update("slug", slugify(e.target.value));
            }} />
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="meu-produto" />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Categoria *</Label>
          <select
            id="category"
            required
            value={form.category_id}
            onChange={(e) => update("category_id", e.target.value)}
            className="w-full border border-input rounded-md px-3 py-2 bg-background"
          >
            <option value="">Selecione uma categoria</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}{c.mega_column ? ` (${c.mega_column})` : ""}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div>
          <Label htmlFor="tech">Informações técnicas</Label>
          <Textarea id="tech" rows={4} value={form.tech_info} onChange={(e) => update("tech_info", e.target.value)} placeholder="Dimensões, materiais, normas, etc." />
        </div>

        <div>
          <Label>Imagens</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {form.images.map((path) => (
              <div key={path} className="relative aspect-square rounded border border-border overflow-hidden bg-muted group">
                <img src={imageUrl(path)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(path)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-border rounded flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition text-xs text-muted-foreground">
              <Upload size={20} className="mb-1" />
              {uploading ? "Enviando..." : "Adicionar"}
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="active" checked={form.active} onCheckedChange={(v) => update("active", v)} />
          <Label htmlFor="active">Produto ativo (visível no site)</Label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/produtos")}>Cancelar</Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProductForm;
