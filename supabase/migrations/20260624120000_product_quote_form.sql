-- Solicitações de orçamento em páginas de produto (todos os campos opcionais)
ALTER TABLE public.form_submissions
  ALTER COLUMN nome DROP NOT NULL,
  ALTER COLUMN telefone DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN assunto DROP NOT NULL,
  ALTER COLUMN mensagem DROP NOT NULL;

ALTER TABLE public.form_submissions
  ADD COLUMN IF NOT EXISTS product_slug text,
  ADD COLUMN IF NOT EXISTS product_name text,
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'contato';

CREATE INDEX IF NOT EXISTS form_submissions_tipo_idx ON public.form_submissions(tipo);
CREATE INDEX IF NOT EXISTS form_submissions_product_slug_idx ON public.form_submissions(product_slug);
