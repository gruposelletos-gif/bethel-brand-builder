import { supabase } from "@/integrations/supabase/client";

export type FormFieldType = "text" | "email" | "tel" | "textarea";

export interface FormFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
  type: FormFieldType;
}

export interface FormConfig {
  id: string;
  slug: string;
  name: string;
  enabled: boolean;
  title: string;
  description: string | null;
  submit_label: string;
  success_message: string;
  fields: FormFieldConfig[];
  updated_at: string;
}

export type FormConfigSlug = "contato" | "orcamento_produto";

const defaultConfigs: Record<FormConfigSlug, Omit<FormConfig, "id" | "updated_at">> = {
  contato: {
    slug: "contato",
    name: "Formulário de Contato",
    enabled: true,
    title: "Entre em contato",
    description: "Fale com nossa equipe e solicite um orçamento personalizado.",
    submit_label: "Enviar Mensagem",
    success_message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
    fields: [
      { key: "nome", label: "Nome", placeholder: "Seu nome…", enabled: true, required: true, type: "text" },
      { key: "empresa", label: "Empresa", placeholder: "Nome da empresa…", enabled: true, required: false, type: "text" },
      { key: "telefone", label: "Telefone", placeholder: "(11) 99999-9999…", enabled: true, required: true, type: "tel" },
      { key: "email", label: "E-mail", placeholder: "seu@email.com…", enabled: true, required: true, type: "email" },
      { key: "assunto", label: "Assunto", placeholder: "Sobre o que você quer falar?…", enabled: true, required: true, type: "text" },
      { key: "mensagem", label: "Mensagem", placeholder: "Escreva sua mensagem…", enabled: true, required: true, type: "textarea" },
    ],
  },
  orcamento_produto: {
    slug: "orcamento_produto",
    name: "Orçamento de Produto",
    enabled: true,
    title: "Solicitação de Orçamento",
    description: "Preencha o que quiser — todos os campos são opcionais.",
    submit_label: "Enviar Solicitação",
    success_message: "Obrigado! Recebemos sua solicitação e retornaremos o contato em breve.",
    fields: [
      { key: "nome", label: "Nome", placeholder: "Seu nome…", enabled: true, required: false, type: "text" },
      { key: "telefone", label: "Telefone", placeholder: "(11) 99999-9999…", enabled: true, required: false, type: "tel" },
      { key: "observacao", label: "Observação", placeholder: "Quantidade, medidas, prazo de entrega…", enabled: true, required: false, type: "textarea" },
    ],
  },
};

const withDefaults = (slug: FormConfigSlug): FormConfig => ({
  ...defaultConfigs[slug],
  id: "",
  updated_at: new Date().toISOString(),
});

const isMissingTableError = (error: { code?: string; message?: string; details?: string }) =>
  error.code === "PGRST205" ||
  error.code === "42P01" ||
  error.message?.includes("404") ||
  error.message?.toLowerCase().includes("could not find the table");

const normalizeConfig = (row: Record<string, unknown>): FormConfig => ({
  id: row.id as string,
  slug: row.slug as string,
  name: row.name as string,
  enabled: row.enabled as boolean,
  title: row.title as string,
  description: (row.description as string | null) ?? null,
  submit_label: row.submit_label as string,
  success_message: row.success_message as string,
  fields: Array.isArray(row.fields) ? (row.fields as FormFieldConfig[]) : [],
  updated_at: row.updated_at as string,
});

export const fetchFormConfig = async (slug: FormConfigSlug): Promise<FormConfig> => {
  const { data, error } = await supabase.from("form_configs").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return withDefaults(slug);
    throw error;
  }
  if (data) return normalizeConfig(data);
  return withDefaults(slug);
};

export const fetchAllFormConfigs = async (): Promise<FormConfig[]> => {
  const { data, error } = await supabase.from("form_configs").select("*").order("slug");
  if (error) {
    if (isMissingTableError(error)) {
      return (Object.keys(defaultConfigs) as FormConfigSlug[]).map(withDefaults);
    }
    throw error;
  }

  const rows = (data ?? []).map(normalizeConfig);
  const slugs = new Set(rows.map((r) => r.slug));

  for (const slug of Object.keys(defaultConfigs) as FormConfigSlug[]) {
    if (!slugs.has(slug)) {
      rows.push(withDefaults(slug));
    }
  }

  return rows.sort((a, b) => a.slug.localeCompare(b.slug));
};

export interface FormConfigUpdate {
  enabled: boolean;
  title: string;
  description: string | null;
  submit_label: string;
  success_message: string;
  fields: FormFieldConfig[];
}

export const updateFormConfig = async (slug: FormConfigSlug, update: FormConfigUpdate) => {
  const { data: existing, error: readError } = await supabase
    .from("form_configs")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (readError && isMissingTableError(readError)) {
    throw new Error(
      "A tabela de configuração ainda não está disponível na API. Aguarde alguns segundos e tente novamente."
    );
  }
  if (readError) throw readError;

  if (existing?.id) {
    const { error } = await supabase
      .from("form_configs")
      .update({
        enabled: update.enabled,
        title: update.title.trim(),
        description: update.description?.trim() || null,
        submit_label: update.submit_label.trim(),
        success_message: update.success_message.trim(),
        fields: update.fields as unknown as import("@/integrations/supabase/types").Json,
      })
      .eq("slug", slug);
    if (error) throw error;
    return;
  }

  const seed = defaultConfigs[slug];
  const { error } = await supabase.from("form_configs").insert({
    slug,
    name: seed.name,
    enabled: update.enabled,
    title: update.title.trim(),
    description: update.description?.trim() || null,
    submit_label: update.submit_label.trim(),
    success_message: update.success_message.trim(),
    fields: update.fields as unknown as import("@/integrations/supabase/types").Json,
  });
  if (error) throw error;
};
