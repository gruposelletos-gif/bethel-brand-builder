import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchFooterSettings,
  footerLogoSrc,
  saveFooterSettings,
  uploadFooterLogo,
  type FooterSettings,
} from "@/lib/footer-settings";
import { toast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createFooterSocialLink,
  FOOTER_SOCIAL_ICON_OPTIONS,
  FooterSocialLink,
} from "@/lib/footer-social";

const AdminFooterSettings = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FooterSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFooterSettings()
      .then(setForm)
      .catch((e) => toast({ title: "Erro", description: e.message, variant: "destructive" }));
  }, []);

  const update = <K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    try {
      const path = await uploadFooterLogo(file);
      update("logo_path", path);
      toast({ title: "Logo enviado" });
    } catch (err) {
      toast({
        title: "Erro no upload",
        description: err instanceof Error ? err.message : "Não foi possível enviar a imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const updateSocial = (id: string, patch: Partial<FooterSocialLink>) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            social_links: prev.social_links.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          }
        : prev,
    );
  };

  const addSocial = () => {
    setForm((prev) =>
      prev ? { ...prev, social_links: [...prev.social_links, createFooterSocialLink()] } : prev,
    );
  };

  const removeSocial = (id: string) => {
    setForm((prev) =>
      prev
        ? { ...prev, social_links: prev.social_links.filter((item) => item.id !== id) }
        : prev,
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    try {
      await saveFooterSettings(form);
      toast({ title: "Rodapé atualizado com sucesso" });
      void queryClient.invalidateQueries({ queryKey: ["footer-settings"] });
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível salvar",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  if (!form) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Carregando configurações...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Configuração do rodapé</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Edite logo, contato e links das redes sociais exibidos no rodapé do site.
      </p>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        <section className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-bold">Logo e descrição</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={footerLogoSrc(form.logo_path)}
              alt="Logo do rodapé"
              className="h-28 w-auto rounded-lg bg-muted p-2 border border-border"
            />
            <div className="space-y-2">
              <Label htmlFor="footer-logo">Trocar logo</Label>
              <Input id="footer-logo" type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
              <p className="text-xs text-muted-foreground">
                {uploading ? "Enviando..." : "PNG, JPG ou WebP. Se não enviar, usa o logo padrão."}
              </p>
              {form.logo_path && (
                <Button type="button" variant="outline" size="sm" onClick={() => update("logo_path", null)}>
                  Usar logo padrão
                </Button>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="footer-description">Texto abaixo do logo</Label>
            <Textarea
              id="footer-description"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              required
            />
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-bold">Contato</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="footer-phone">Telefone / WhatsApp (texto)</Label>
              <Input id="footer-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="footer-phone-link">Link do WhatsApp</Label>
              <Input
                id="footer-phone-link"
                type="url"
                value={form.phone_link}
                onChange={(e) => update("phone_link", e.target.value)}
                placeholder="https://wa.me/5511999999999"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="footer-email">E-mail</Label>
              <Input
                id="footer-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="footer-address">Endereço (texto)</Label>
              <Textarea
                id="footer-address"
                rows={2}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="footer-address-link">Link do mapa (Google Maps)</Label>
              <Input
                id="footer-address-link"
                type="url"
                value={form.address_link}
                onChange={(e) => update("address_link", e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold">Redes sociais</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione quantas redes quiser. Só aparecem no site se tiverem link preenchido.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={addSocial}>
              <Plus size={16} /> Adicionar rede
            </Button>
          </div>

          {form.social_links.length === 0 ? (
            <p className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-4 text-center">
              Nenhuma rede cadastrada. Clique em &quot;Adicionar rede&quot; para começar.
            </p>
          ) : (
            <div className="space-y-3">
              {form.social_links.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 sm:grid-cols-[140px_1fr_1fr_auto] sm:items-end border border-border rounded-lg p-4"
                >
                  <div>
                    <Label>Ícone</Label>
                    <Select
                      value={item.icon}
                      onValueChange={(v) =>
                        updateSocial(item.id, {
                          icon: v as FooterSocialLink["icon"],
                          label:
                            item.label ||
                            FOOTER_SOCIAL_ICON_OPTIONS.find((o) => o.value === v)?.label ||
                            "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FOOTER_SOCIAL_ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nome (acessibilidade)</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateSocial(item.id, { label: e.target.value })}
                      placeholder="Ex: Instagram da Bethel"
                    />
                  </div>
                  <div>
                    <Label>Link</Label>
                    <Input
                      type="url"
                      value={item.url}
                      onChange={(e) => updateSocial(item.id, { url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSocial(item.id)}
                    aria-label="Remover rede social"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-bold">Créditos do rodapé</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="footer-credit-label">Texto do link</Label>
              <Input
                id="footer-credit-label"
                value={form.credit_label}
                onChange={(e) => update("credit_label", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="footer-credit-url">URL do link</Label>
              <Input
                id="footer-credit-url"
                type="url"
                value={form.credit_url}
                onChange={(e) => update("credit_url", e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <Button type="submit" disabled={busy || uploading}>
          {busy ? "Salvando..." : <><Save size={16} /> Salvar configurações</>}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminFooterSettings;
