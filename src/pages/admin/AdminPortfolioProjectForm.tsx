import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  buildPortfolioSlug,
  deletePortfolioStorageImage,
  uploadPortfolioImage,
} from "@/lib/portfolio-projects";
import { imageUrl, slugify } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ChevronDown, ChevronUp, Star, Trash2, Upload } from "lucide-react";

const AdminPortfolioProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    images: [] as string[],
    cover_index: 0,
    sort_order: 0,
    active: true,
  });

  useEffect(() => {
    if (!isEdit) return;
    supabase
      .from("portfolio_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Erro", description: error.message, variant: "destructive" });
          return;
        }
        if (data) {
          setForm({
            title: data.title,
            slug: data.slug,
            description: data.description,
            images: Array.isArray(data.images) ? (data.images as string[]) : [],
            cover_index: data.cover_index ?? 0,
            sort_order: data.sort_order ?? 0,
            active: data.active,
          });
        }
      });
  }, [id, isEdit]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadPortfolioImage(file));
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
      toast({ title: "Imagens enviadas" });
    } catch (err) {
      toast({
        title: "Erro no upload",
        description: err instanceof Error ? err.message : "Falha ao enviar imagens",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = async (path: string, index: number) => {
    setForm((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      let cover_index = prev.cover_index;
      if (index === cover_index) cover_index = 0;
      else if (index < cover_index) cover_index -= 1;
      if (cover_index >= images.length) cover_index = Math.max(0, images.length - 1);
      return { ...prev, images, cover_index };
    });
    await deletePortfolioStorageImage(path);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= form.images.length) return;
    const images = [...form.images];
    [images[index], images[next]] = [images[next], images[index]];
    let cover_index = form.cover_index;
    if (cover_index === index) cover_index = next;
    else if (cover_index === next) cover_index = index;
    update("images", images);
    update("cover_index", cover_index);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast({ title: "Adicione pelo menos uma imagem", variant: "destructive" });
      return;
    }
    setBusy(true);
    const payload = {
      title: form.title.trim(),
      slug: (form.slug || buildPortfolioSlug(form.title)).trim(),
      description: form.description.trim(),
      images: form.images,
      cover_index: Math.min(form.cover_index, form.images.length - 1),
      sort_order: form.sort_order,
      active: form.active,
    };
    const res = isEdit
      ? await supabase.from("portfolio_projects").update(payload).eq("id", id!)
      : await supabase.from("portfolio_projects").insert(payload);
    setBusy(false);
    if (res.error) {
      toast({ title: "Erro", description: res.error.message, variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Projeto atualizado" : "Projeto criado" });
    navigate("/admin/projetos");
  };

  return (
    <AdminLayout>
      <Link
        to="/admin/projetos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft size={16} /> Voltar para projetos
      </Link>

      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">
        {isEdit ? "Editar projeto" : "Novo projeto"}
      </h1>

      <form onSubmit={submit} className="max-w-3xl space-y-6">
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: isEdit ? prev.slug : slugify(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sort_order">Ordem de exibição</Label>
              <Input
                id="sort_order"
                type="number"
                value={form.sort_order}
                onChange={(e) => update("sort_order", Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.active} onCheckedChange={(v) => update("active", v)} id="active" />
              <Label htmlFor="active">Exibir no site</Label>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold">Galeria de fotos</h2>
              <p className="text-sm text-muted-foreground">
                A foto marcada com estrela é a capa do card na home.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} /> {uploading ? "Enviando..." : "Adicionar fotos"}
              </Button>
            </div>
          </div>

          {form.images.length === 0 ? (
            <p className="text-sm text-muted-foreground border border-dashed rounded-lg p-4 text-center">
              Nenhuma imagem. Envie fotos do projeto.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images.map((path, index) => (
                <div key={`${path}-${index}`} className="relative group border border-border rounded-lg overflow-hidden">
                  <img src={imageUrl(path)} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between gap-1 bg-background/90">
                    <Button
                      type="button"
                      size="sm"
                      variant={form.cover_index === index ? "default" : "outline"}
                      onClick={() => update("cover_index", index)}
                      title="Definir como capa"
                    >
                      <Star size={14} />
                    </Button>
                    <div className="flex gap-1">
                      <Button type="button" size="sm" variant="outline" onClick={() => moveImage(index, -1)}>
                        <ChevronUp size={14} />
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => moveImage(index, 1)}>
                        <ChevronDown size={14} />
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => removeImage(path, index)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={busy || uploading}>
          {busy ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar projeto"}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminPortfolioProjectForm;
