import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";

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
    value: "contato@toceart.com.br",
    href: "mailto:contato@toceart.com.br",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: "Rua Azuma, 80, Penha — Bragança Paulista - SP",
    href: "https://www.google.com/maps/search/?api=1&query=Rua+Azuma+80+Penha+Bragança+Paulista+SP",
  },
];

const ContactSection = () => {
  const [form, setForm] = useState({ nome: "", empresa: "", telefone: "", email: "", assunto: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setForm({ nome: "", empresa: "", telefone: "", email: "", assunto: "", mensagem: "" });
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <section id="contato" className="section-padding bg-background">
      <div className="container-bethel">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Entre em <span className="text-gradient">contato</span>
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-lg mx-auto text-sm md:text-base">
            Fale com nossa equipe e solicite um orçamento personalizado.
          </p>
          <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-6">
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
                  <p className="font-body text-muted-foreground text-sm group-hover:text-primary transition-colors">{c.value}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-card rounded-xl p-8 border border-border shadow-sm"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { field: "nome", label: "Nome", type: "text" },
                { field: "empresa", label: "Empresa", type: "text" },
                { field: "telefone", label: "Telefone", type: "tel" },
                { field: "email", label: "E-mail", type: "email" },
              ].map((f) => (
                <div key={f.field}>
                  <label className="font-heading text-xs font-semibold text-foreground mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.field as keyof typeof form]}
                    onChange={(e) => update(f.field, e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="font-heading text-xs font-semibold text-foreground mb-1 block">Assunto</label>
              <input
                type="text"
                value={form.assunto}
                onChange={(e) => update("assunto", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="mb-6">
              <label className="font-heading text-xs font-semibold text-foreground mb-1 block">Mensagem</label>
              <textarea
                rows={4}
                value={form.mensagem}
                onChange={(e) => update("mensagem", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
              />
            </div>
            <button type="submit" className="w-full gradient-primary text-primary-foreground font-heading font-bold text-sm tracking-wide py-4 rounded-lg hover:opacity-90 transition-opacity">
              Enviar mensagem
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
