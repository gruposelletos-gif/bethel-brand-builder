-- Configuração dos formulários do site (admin)
CREATE TABLE public.form_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  title text NOT NULL,
  description text,
  submit_label text NOT NULL DEFAULT 'Enviar',
  success_message text NOT NULL,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.form_configs ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.form_configs TO anon, authenticated;
GRANT ALL ON public.form_configs TO service_role;
GRANT UPDATE ON public.form_configs TO authenticated;

CREATE POLICY "Form configs are publicly readable" ON public.form_configs
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update form configs" ON public.form_configs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert form configs" ON public.form_configs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER form_configs_set_updated_at
  BEFORE UPDATE ON public.form_configs
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.form_configs (slug, name, title, description, submit_label, success_message, fields) VALUES
(
  'contato',
  'Formulário de Contato',
  'Entre em contato',
  'Fale com nossa equipe e solicite um orçamento personalizado.',
  'Enviar Mensagem',
  'Mensagem enviada com sucesso! Entraremos em contato em breve.',
  '[
    {"key":"nome","label":"Nome","placeholder":"Seu nome…","enabled":true,"required":true,"type":"text"},
    {"key":"empresa","label":"Empresa","placeholder":"Nome da empresa…","enabled":true,"required":false,"type":"text"},
    {"key":"telefone","label":"Telefone","placeholder":"(11) 99999-9999…","enabled":true,"required":true,"type":"tel"},
    {"key":"email","label":"E-mail","placeholder":"seu@email.com…","enabled":true,"required":true,"type":"email"},
    {"key":"assunto","label":"Assunto","placeholder":"Sobre o que você quer falar?…","enabled":true,"required":true,"type":"text"},
    {"key":"mensagem","label":"Mensagem","placeholder":"Escreva sua mensagem…","enabled":true,"required":true,"type":"textarea"}
  ]'::jsonb
),
(
  'orcamento_produto',
  'Orçamento de Produto',
  'Solicitação de Orçamento',
  'Preencha o que quiser — todos os campos são opcionais.',
  'Enviar Solicitação',
  'Obrigado! Recebemos sua solicitação e retornaremos o contato em breve.',
  '[
    {"key":"nome","label":"Nome","placeholder":"Seu nome…","enabled":true,"required":false,"type":"text"},
    {"key":"telefone","label":"Telefone","placeholder":"(11) 99999-9999…","enabled":true,"required":false,"type":"tel"},
    {"key":"observacao","label":"Observação","placeholder":"Quantidade, medidas, prazo de entrega…","enabled":true,"required":false,"type":"textarea"}
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
