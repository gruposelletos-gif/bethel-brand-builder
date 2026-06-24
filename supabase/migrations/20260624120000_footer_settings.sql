-- Configuração editável do rodapé do site (singleton id = 1)
CREATE TABLE public.footer_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  logo_path text,
  description text NOT NULL DEFAULT 'Comércio de produtos de acessibilidade e prestação de serviços com qualidade e excelência.',
  phone text NOT NULL DEFAULT '(11) 9 9162-8441',
  phone_link text NOT NULL DEFAULT 'https://wa.me/5511991628441',
  email text NOT NULL DEFAULT 'vendas@bethel.ind.br',
  address text NOT NULL DEFAULT 'Rua Francisco de Souza Dias Guimaraes, 80 — Centro Industrial Rafael Diniz — Bragança Paulista/SP',
  address_link text NOT NULL DEFAULT 'https://www.google.com/maps/search/?api=1&query=Rua+Francisco+de+Souza+Dias+Guimaraes+80+Centro+Industrial+Rafael+Diniz+Bragança+Paulista+SP',
  social_instagram text,
  social_facebook text,
  social_linkedin text,
  credit_url text NOT NULL DEFAULT 'https://selletos.com.br',
  credit_label text NOT NULL DEFAULT 'selletos.com.br',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.footer_settings (id) VALUES (1);

ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.footer_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.footer_settings TO authenticated;
GRANT ALL ON public.footer_settings TO service_role;

CREATE POLICY "Footer settings are publicly readable" ON public.footer_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update footer settings" ON public.footer_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert footer settings" ON public.footer_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
