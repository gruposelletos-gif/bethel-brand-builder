import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";

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
          <div className="w-20 h-1 gradient-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-8">
            {[
              { icon: Phone, label: "Telefone", value: "(00) 0000-0000", href: "tel:+550000000000" },
              { icon: MessageCircle, label: "WhatsApp", value: "(00) 00000-0000", href: "https://wa.me/5500000000000" },
              { icon: Mail, label: "E-mail", value: "contato@bethel.com.br", href: "mailto:contato@bethel.com.br" },
              { icon: MapPin, label: "Endereço", value: "Rua Exemplo, 123 — Cidade/UF", href: "#" },
            ].map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="flex gap-4 items-start group">
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <c.icon className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">{c.label}</p>
                  <p className="font-body text-muted-foreground text-sm group-hover:text-primary transition-colors">{c.value}</p>
                </div>
              </a>
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
