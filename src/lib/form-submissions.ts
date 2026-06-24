import { supabase } from "@/integrations/supabase/client";

export interface FormSubmission {
  id: string;
  user_id: string | null;
  nome: string | null;
  empresa: string | null;
  telefone: string | null;
  email: string | null;
  assunto: string | null;
  mensagem: string | null;
  product_slug: string | null;
  product_name: string | null;
  tipo: string;
  created_at: string;
}

export interface FormSubmissionInput {
  nome: string;
  empresa?: string;
  telefone: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export interface ProductQuoteInput {
  product_slug: string;
  product_name: string;
  nome?: string;
  telefone?: string;
  observacao?: string;
}

export const fetchFormSubmissions = async (): Promise<FormSubmission[]> => {
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as FormSubmission[];
};

export const submitForm = async (input: {
  nome?: string;
  empresa?: string;
  telefone?: string;
  email?: string;
  assunto?: string;
  mensagem?: string;
}) => {
  const { error } = await supabase.from("form_submissions").insert({
    tipo: "contato",
    nome: input.nome?.trim() || null,
    empresa: input.empresa?.trim() || null,
    telefone: input.telefone?.trim() || null,
    email: input.email?.trim() || null,
    assunto: input.assunto?.trim() || null,
    mensagem: input.mensagem?.trim() || null,
  });

  if (error) throw error;
};

export const submitProductQuote = async (input: ProductQuoteInput) => {
  const { error } = await supabase.from("form_submissions").insert({
    tipo: "orcamento_produto",
    product_slug: input.product_slug,
    product_name: input.product_name,
    nome: input.nome?.trim() || null,
    telefone: input.telefone?.trim() || null,
    mensagem: input.observacao?.trim() || null,
    email: null,
    assunto: `Orçamento: ${input.product_name}`,
  });

  if (error) throw error;
};

export const deleteFormSubmission = async (id: string) => {
  const { error } = await supabase.from("form_submissions").delete().eq("id", id);
  if (error) throw error;
};
