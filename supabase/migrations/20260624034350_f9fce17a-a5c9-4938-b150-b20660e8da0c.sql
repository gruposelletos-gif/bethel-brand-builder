
-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- footer_settings
CREATE TABLE IF NOT EXISTS public.footer_settings (
  id bigint PRIMARY KEY,
  logo_path text,
  description text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  phone_link text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  address_link text NOT NULL DEFAULT '',
  social_instagram text,
  social_facebook text,
  social_linkedin text,
  social_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  credit_url text NOT NULL DEFAULT '',
  credit_label text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.footer_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.footer_settings TO authenticated;
GRANT ALL ON public.footer_settings TO service_role;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Footer is public" ON public.footer_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage footer" ON public.footer_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.footer_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- form_configs
CREATE TABLE IF NOT EXISTS public.form_configs (
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
GRANT SELECT ON public.form_configs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.form_configs TO authenticated;
GRANT ALL ON public.form_configs TO service_role;
ALTER TABLE public.form_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Form configs are public" ON public.form_configs FOR SELECT USING (true);
CREATE POLICY "Admins manage form configs" ON public.form_configs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- form_submissions
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  nome text,
  empresa text,
  telefone text,
  email text,
  assunto text,
  mensagem text,
  product_slug text,
  product_name text,
  tipo text NOT NULL DEFAULT 'contato',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.form_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.form_submissions TO authenticated;
GRANT ALL ON public.form_submissions TO service_role;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Privileged can read submissions" ON public.form_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'viewer') OR public.has_role(auth.uid(), 'client'));
CREATE POLICY "Admins can delete submissions" ON public.form_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- portfolio_projects
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  cover_index integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active projects are public" ON public.portfolio_projects FOR SELECT USING (active = true);
CREATE POLICY "Authenticated read all projects" ON public.portfolio_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage projects" ON public.portfolio_projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_footer_settings_updated_at BEFORE UPDATE ON public.footer_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER set_form_configs_updated_at BEFORE UPDATE ON public.form_configs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER set_portfolio_projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
