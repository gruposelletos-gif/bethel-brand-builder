import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitProductQuote } from "@/lib/form-submissions";
import { fetchFormConfig, type FormFieldConfig } from "@/lib/form-configs";

interface ProductQuoteFormProps {
  productSlug: string;
  productName: string;
}

const ProductQuoteForm = ({ productSlug, productName }: ProductQuoteFormProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Awaited<ReturnType<typeof fetchFormConfig>> | null>(null);

  useEffect(() => {
    fetchFormConfig("orcamento_produto")
      .then(setConfig)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!config?.enabled) return null;

  const visibleFields = config.fields.filter((f) => f.enabled);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const field of visibleFields) {
      if (field.required && !values[field.key]?.trim()) {
        toast.error(`Preencha o campo "${field.label}".`);
        return;
      }
    }

    setBusy(true);
    try {
      await submitProductQuote({
        product_slug: productSlug,
        product_name: productName,
        nome: values.nome || undefined,
        telefone: values.telefone || undefined,
        observacao: values.observacao || undefined,
      });
      setSent(true);
      setValues({});
      toast.success(config.success_message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível enviar a solicitação");
    } finally {
      setBusy(false);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const optional = !field.required;
    const label = (
      <Label htmlFor={`quote-${field.key}`} className="text-xs font-semibold">
        {field.label}{" "}
        {optional && <span className="font-normal text-muted-foreground">(opcional)</span>}
      </Label>
    );

    if (field.type === "textarea") {
      return (
        <div key={field.key}>
          {label}
          <Textarea
            id={`quote-${field.key}`}
            name={field.key}
            rows={4}
            value={values[field.key] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            placeholder={field.placeholder}
            required={field.required}
            className="mt-1.5 resize-y"
          />
        </div>
      );
    }

    return (
      <div key={field.key}>
        {label}
        <Input
          id={`quote-${field.key}`}
          name={field.key}
          type={field.type}
          inputMode={field.type === "tel" ? "tel" : undefined}
          autoComplete={field.key === "nome" ? "name" : field.type === "tel" ? "tel" : undefined}
          value={values[field.key] ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
          placeholder={field.placeholder}
          required={field.required}
          className="mt-1.5"
        />
      </div>
    );
  };

  const inlineFields = visibleFields.filter((f) => f.type !== "textarea");
  const blockFields = visibleFields.filter((f) => f.type === "textarea");

  return (
    <section
      aria-labelledby="quote-form-title"
      className="mt-12 md:mt-16 rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm"
    >
      <div className="mb-6 max-w-2xl">
        <h2 id="quote-form-title" className="font-heading text-xl md:text-2xl font-bold text-balance">
          {config.title}
        </h2>
        {config.description && (
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            {config.description.replace("{produto}", productName)}
            {!config.description.includes("{produto}") && (
              <>
                {" "}
                Interessado em <span className="font-medium text-foreground">{productName}</span>?
              </>
            )}
          </p>
        )}
      </div>

      {sent ? (
        <div role="status" className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          {config.success_message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid max-w-xl gap-4">
          {inlineFields.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {inlineFields.map(renderField)}
            </div>
          )}
          {blockFields.map(renderField)}
          <Button type="submit" disabled={busy} size="lg" className="w-full sm:w-auto touch-manipulation">
            <Send size={16} aria-hidden="true" />
            {busy ? "Enviando…" : config.submit_label}
          </Button>
        </form>
      )}
    </section>
  );
};

export default ProductQuoteForm;
