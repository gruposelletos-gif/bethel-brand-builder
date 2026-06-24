import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { submitForm } from "@/lib/form-submissions";
import { fetchFormConfig, type FormFieldConfig } from "@/lib/form-configs";

const contactInfo = [
  {
    icon: MessageCircle,
    label: "WhatsApp / Telefone",
    value: "(11) 9 9962-8441",
    href: "https://wa.me/5511999628441",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "vendas@bethel.ind.br",
    href: "mailto:vendas@bethel.ind.br",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: "Rua Francisco de Souza Dias Guimaraes, 80 — Centro Industrial Rafael Diniz — Bragança Paulista/SP",
    href: "https://www.google.com/maps/search/?api=1&query=Rua+Francisco+de+Souza+Dias+Guimaraes+80+Centro+Industrial+Rafael+Diniz+Bragança+Paulista+SP",
  },
];

const ContactSection = () => {
  const { user, isClient } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<Awaited<ReturnType<typeof fetchFormConfig>> | null>(null);

  useEffect(() => {
    fetchFormConfig("contato").then((cfg) => {
      setConfig(cfg);
      setValues((prev) => ({ ...prev, email: user?.email ?? prev.email ?? "" }));
    });
  }, [user?.email]);

  const update = (field: string, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    const visible = config.fields.filter((f) => f.enabled);
    for (const field of visible) {
      if (field.required && !values[field.key]?.trim()) {
        toast.error(`Preencha o campo "${field.label}".`);
        return;
      }
    }

    setBusy(true);
    try {
      await submitForm({
        nome: values.nome ?? "",
        empresa: values.empresa,
        telefone: values.telefone ?? "",
        email: values.email ?? "",
        assunto: values.assunto ?? "",
        mensagem: values.mensagem ?? "",
      });
      toast.success(
        isClient
          ? "Formulário enviado! Você pode acompanhar em Meus formulários."
          : config.success_message
      );
      setValues({ email: user?.email ?? "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível enviar o formulário");
    } finally {
      setBusy(false);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const inputClass =
      "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-[border-color,box-shadow]";

    if (field.type === "textarea") {
      return (
        <div key={field.key} className="mb-4">
          <label className="font-heading text-xs font-semibold text-foreground mb-1 block">
            {field.label}
          </label>
          <textarea
            rows={4}
            value={values[field.key] ?? ""}
            onChange={(e) => update(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={`${inputClass} resize-none`}
          />
        </div>
      );
    }

    return (
      <div key={field.key}>
        <label className="font-heading text-xs font-semibold text-foreground mb-1 block">
          {field.label}
        </label>
        <input
          type={field.type}
          value={values[field.key] ?? ""}
          onChange={(e) => update(field.key, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={inputClass}
        />
      </div>
    );
  };

  const visibleFields = config?.fields.filter((f) => f.enabled) ?? [];
  const gridFields = visibleFields.filter((f) => f.type !== "textarea");
  const blockFields = visibleFields.filter((f) => f.type === "textarea");
  const showForm = config?.enabled !== false;

  return (
    <section id="contato" className="section-padding bg-background">
      <div className="container-bethel">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {config?.title ? (
              config.title
            ) : (
              <>
                Entre em <span className="text-gradient">contato</span>
              </>
            )}
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-lg mx-auto text-sm md:text-base">
            {config?.description ?? "Fale com nossa equipe e solicite um orçamento personalizado."}
          </p>
          {isClient && (
            <p className="text-xs text-primary mt-2">
              Você está logado como cliente — este formulário ficará salvo na sua área.
            </p>
          )}
          <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <c.icon className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">{c.label}</p>
                  <p className="font-body text-muted-foreground text-sm group-hover:text-primary transition-colors">
                    {c.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {showForm && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-card rounded-xl p-8 border border-border shadow-sm"
            >
              {gridFields.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {gridFields.map(renderField)}
                </div>
              )}
              {blockFields.map(renderField)}
              <button
                type="submit"
                disabled={busy || !config}
                className="w-full gradient-primary text-primary-foreground font-heading font-bold text-sm tracking-wide py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {busy ? "Enviando…" : config?.submit_label ?? "Enviar mensagem"}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
