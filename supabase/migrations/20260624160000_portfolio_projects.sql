CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  cover_index int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX portfolio_projects_sort_idx ON public.portfolio_projects(sort_order);
CREATE INDEX portfolio_projects_active_idx ON public.portfolio_projects(active);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;

CREATE POLICY "Active portfolio projects are publicly readable" ON public.portfolio_projects
  FOR SELECT TO anon USING (active = true);

CREATE POLICY "Authenticated can read all portfolio projects" ON public.portfolio_projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert portfolio projects" ON public.portfolio_projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio projects" ON public.portfolio_projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio projects" ON public.portfolio_projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER portfolio_projects_set_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
