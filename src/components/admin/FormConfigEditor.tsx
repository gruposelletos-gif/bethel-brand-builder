import { useEffect, useState } from "react";
import { Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchAllFormConfigs,
  updateFormConfig,
  type FormConfig,
  type FormConfigSlug,
  type FormFieldConfig,
} from "@/lib/form-configs";
import { toast } from "@/hooks/use-toast";

const slugLabels: Record<FormConfigSlug, string> = {
  contato: "Contato",
  orcamento_produto: "Orçamento de Produto",
};

const FormConfigEditor = () => {
  const [configs, setConfigs] = useState<FormConfig[]>([]);
  const [activeSlug, setActiveSlug] = useState<FormConfigSlug>("contato");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFormConfigs();
      setConfigs(data);
    } catch (e) {
      toast({
        title: "Erro ao carregar configurações",
        description: e instanceof Error ? e.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateConfig = (slug: FormConfigSlug, patch: Partial<FormConfig>) => {
    setConfigs((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, ...patch } : c))
    );
  };

  const updateField = (slug: FormConfigSlug, index: number, patch: Partial<FormFieldConfig>) => {
    setConfigs((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const fields = c.fields.map((f, i) => (i === index ? { ...f, ...patch } : f));
        return { ...c, fields };
      })
    );
  };

  const save = async (slug: FormConfigSlug) => {
    const cfg = configs.find((c) => c.slug === slug);
    if (!cfg) return;
    setBusy(true);
    try {
      await updateFormConfig(slug, {
        enabled: cfg.enabled,
        title: cfg.title,
        description: cfg.description,
        submit_label: cfg.submit_label,
        success_message: cfg.success_message,
        fields: cfg.fields,
      });
      toast({ title: "Configuração salva", description: `${cfg.name} atualizado no site.` });
      void load();
    } catch (e) {
      toast({
        title: "Erro ao salvar",
        description: e instanceof Error ? e.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Carregando configurações…
      </div>
    );
  }

  if (!configs.length) return null;

  return (
    <div className="space-y-6">
      <Tabs
        value={activeSlug}
        onValueChange={(v) => setActiveSlug(v as FormConfigSlug)}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          {(Object.keys(slugLabels) as FormConfigSlug[]).map((slug) => (
            <TabsTrigger key={slug} value={slug}>
              {slugLabels[slug]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(slugLabels) as FormConfigSlug[]).map((slug) => {
          const cfg = configs.find((c) => c.slug === slug);
          if (!cfg) return null;

          return (
            <TabsContent key={slug} value={slug} className="mt-6 space-y-6">
              <section className="rounded-xl border border-border bg-card p-5 md:p-6">
                <div className="mb-5 flex items-start gap-3 border-b border-border/60 pb-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Settings2 size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-heading text-sm font-bold">{cfg.name}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Textos e campos exibidos no site público.
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                  <div>
                    <Label htmlFor={`${slug}-enabled`} className="font-medium">
                      Formulário ativo
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Desativado = não aparece no site.
                    </p>
                  </div>
                  <Switch
                    id={`${slug}-enabled`}
                    checked={cfg.enabled}
                    onCheckedChange={(v) => updateConfig(slug, { enabled: v })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor={`${slug}-title`}>Título</Label>
                    <Input
                      id={`${slug}-title`}
                      value={cfg.title}
                      onChange={(e) => updateConfig(slug, { title: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${slug}-submit`}>Texto do botão</Label>
                    <Input
                      id={`${slug}-submit`}
                      value={cfg.submit_label}
                      onChange={(e) => updateConfig(slug, { submit_label: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor={`${slug}-description`}>Descrição</Label>
                  <Textarea
                    id={`${slug}-description`}
                    rows={2}
                    value={cfg.description ?? ""}
                    onChange={(e) => updateConfig(slug, { description: e.target.value })}
                    className="mt-1.5 resize-y"
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor={`${slug}-success`}>Mensagem de sucesso</Label>
                  <Textarea
                    id={`${slug}-success`}
                    rows={2}
                    value={cfg.success_message}
                    onChange={(e) => updateConfig(slug, { success_message: e.target.value })}
                    className="mt-1.5 resize-y"
                  />
                </div>
              </section>

              <section className="rounded-xl border border-border bg-card p-5 md:p-6">
                <h3 className="font-heading text-sm font-bold mb-4">Campos do formulário</h3>
                <div className="space-y-4">
                  {cfg.fields.map((field, index) => (
                    <div
                      key={field.key}
                      className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-medium text-sm capitalize">{field.key}</p>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={field.enabled}
                              onCheckedChange={(v) => updateField(slug, index, { enabled: v })}
                              aria-label={`Exibir campo ${field.label}`}
                            />
                            Exibir
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={field.required}
                              disabled={!field.enabled}
                              onCheckedChange={(v) => updateField(slug, index, { required: v })}
                              aria-label={`Campo ${field.label} obrigatório`}
                            />
                            Obrigatório
                          </label>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label className="text-xs">Rótulo</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(slug, index, { label: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Placeholder</Label>
                          <Input
                            value={field.placeholder}
                            onChange={(e) => updateField(slug, index, { placeholder: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <Button onClick={() => void save(slug)} disabled={busy} size="lg">
                <Save size={16} aria-hidden="true" />
                {busy ? "Salvando…" : "Salvar Configuração"}
              </Button>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FormConfigEditor;
