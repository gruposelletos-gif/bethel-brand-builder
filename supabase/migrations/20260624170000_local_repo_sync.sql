-- Sincronização idempotente do repositório com o banco remoto
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';

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

ALTER TABLE public.footer_settings
  ADD COLUMN IF NOT EXISTS social_links jsonb NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO public.footer_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

UPDATE public.footer_settings
SET social_links = '[
  {"id":"footer-social-instagram","label":"Instagram","icon":"instagram","url":"https://www.instagram.com/bethelacessibilidade/"},
  {"id":"footer-social-facebook","label":"Facebook","icon":"facebook","url":"https://www.facebook.com/bethelacessibilidade"},
  {"id":"footer-social-linkedin","label":"LinkedIn","icon":"linkedin","url":"https://www.linkedin.com/company/bethel-acessibilidade/"}
]'::jsonb,
updated_at = now()
WHERE id = 1
  AND (social_links IS NULL OR social_links = '[]'::jsonb);

GRANT UPDATE ON public.form_configs TO authenticated;

REVOKE EXECUTE ON FUNCTION public.set_form_submission_user() FROM PUBLIC, anon;

NOTIFY pgrst, 'reload schema';
