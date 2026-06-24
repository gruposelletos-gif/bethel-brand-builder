import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import ProductPreview from "@/components/admin/ProductPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Category, fetchCategories, imageUrl, slugify } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Upload,
  X,
  ChevronUp,
  ChevronDown,
  Star,
  Link2,
  ImageIcon,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    sort_order: 0,
    images: [] as string[],
  });

  useEffect(() => {
    fetchCategories().then(setCats);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;

    let cancelled = false;

    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setForm({
          name: data.name,
          slug: data.slug,
          category_id: data.category_id ?? "",
          description: data.description ?? "",
          tech_info: data.tech_info ?? "",
          active: data.active,
          sort_order: data.sort_order ?? 0,
          images: Array.isArray(data.images) ? (data.images as string[]) : [],
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handlePreviewFieldChange = (
    field: "name" | "description" | "tech_info" | "category_id",
    value: string
  ) => {
    if (field === "name") {
      update("name", value);
      if (!isEdit) update("slug", slugify(value));
      return;
    }
    update(field, value);
  };

  const categoryName = useMemo(
    () => cats.find((c) => c.id === form.category_id)?.name,
    [cats, form.category_id]
  );

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ title: "Erro no upload", description: message, variant: "destructive" });
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

  const moveImage = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= form.images.length) return;
    const images = [...form.images];
    [images[index], images[next]] = [images[next], images[index]];
    setForm((f) => ({ ...f, images }));
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
      sort_order: form.sort_order,
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
    queryClient.invalidateQueries({ queryKey: ["mega-menu"] });
    navigate("/admin/produtos");
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
  }) => (
    <div className="flex items-start gap-3 pb-4 border-b border-border/60 mb-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <h2 className="font-heading text-sm font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/produtos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Voltar para produtos
        </Link>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-balance">
          {isEdit ? "Editar produto" : "Novo produto"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 text-pretty">
          Edite os textos direto na pré-visualização e configure URL, imagens e publicação abaixo.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
        <aside className="order-first xl:order-last xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-xl border border-border bg-gradient-to-b from-muted/30 to-card p-4 md:p-5">
            <ProductPreview
              editable
              showModeToggle={false}
              categories={cats}
              onFieldChange={handlePreviewFieldChange}
              data={{
                name: form.name,
                description: form.description,
                tech_info: form.tech_info,
                images: form.images,
                categoryName,
                category_id: form.category_id,
                active: form.active,
                sort_order: form.sort_order,
              }}
            />
          </div>
        </aside>

        <form onSubmit={submit} className="order-last xl:order-first space-y-6">
          <section className="rounded-xl border border-border bg-card p-5 md:p-6">
            <SectionHeader
              icon={Link2}
              title="URL e organização"
              description="Endereço do produto no site, categoria e posição na listagem."
            />
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => update("slug", slugify(e.target.value))}
                    placeholder="barra-de-apoio-articulada…"
                    className="mt-1.5 font-mono text-sm"
                    name="slug"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="sort_order">Posição na listagem</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={(e) => update("sort_order", parseInt(e.target.value, 10) || 0)}
                    className="mt-1.5 tabular-nums"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Número menor aparece primeiro na categoria.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="category-form">Categoria *</Label>
                <select
                  id="category-form"
                  required
                  value={form.category_id}
                  onChange={(e) => update("category_id", e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecione uma categoria</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.mega_column ? ` (${c.mega_column})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 md:p-6">
            <SectionHeader
              icon={ImageIcon}
              title="Imagens"
              description="A primeira imagem é a capa no catálogo. Reordene com as setas."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images.map((path, index) => (
                <div
                  key={path}
                  className={cn(
                    "relative aspect-square rounded-lg border overflow-hidden bg-muted group",
                    index === 0 ? "border-primary ring-2 ring-primary/20" : "border-border"
                  )}
                >
                  <img
                    src={imageUrl(path)}
                    alt=""
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
                      <Star size={9} aria-hidden="true" /> Capa
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-0.5 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                    <div className="flex gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="rounded bg-white/90 p-1 text-foreground disabled:opacity-40"
                        aria-label="Mover para cima"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === form.images.length - 1}
                        className="rounded bg-white/90 p-1 text-foreground disabled:opacity-40"
                        aria-label="Mover para baixo"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(path)}
                      className="rounded bg-destructive p-1 text-destructive-foreground"
                      aria-label="Remover imagem"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/60 hover:border-primary/40 motion-safe:transition-[background-color,border-color] motion-safe:duration-200 text-xs text-muted-foreground touch-manipulation">
                <Upload size={22} className="mb-1.5 text-primary/70" aria-hidden="true" />
                {uploading ? "Enviando…" : "Adicionar fotos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 md:p-6">
            <SectionHeader
              icon={Settings2}
              title="Publicação"
              description="Controle se o produto fica visível no site público."
            />
            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
              <div>
                <Label htmlFor="active" className="font-medium">
                  Produto ativo
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Desativado = só visível no painel admin.
                </p>
              </div>
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(v) => update("active", v)}
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={busy || !form.name.trim() || !form.category_id} size="lg">
              {busy ? "Salvando…" : isEdit ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate("/admin/produtos")}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;
