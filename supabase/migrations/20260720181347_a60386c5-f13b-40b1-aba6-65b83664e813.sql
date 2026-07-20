
-- 1. Create private schema and move has_role there
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

-- 2. Recreate all policies that referenced public.has_role, now referencing private.has_role

-- categories
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- footer_settings
DROP POLICY IF EXISTS "Admins manage footer" ON public.footer_settings;
CREATE POLICY "Admins manage footer" ON public.footer_settings
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- form_configs
DROP POLICY IF EXISTS "Admins manage form configs" ON public.form_configs;
CREATE POLICY "Admins manage form configs" ON public.form_configs
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- form_submissions
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.form_submissions;
CREATE POLICY "Admins can delete submissions" ON public.form_submissions
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Restrict read to admin only (fixes form_submissions_privileged_read_includes_client)
DROP POLICY IF EXISTS "Privileged can read submissions" ON public.form_submissions;
CREATE POLICY "Admins can read submissions" ON public.form_submissions
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Replace overly permissive INSERT policy (fixes SUPA_rls_policy_always_true)
DROP POLICY IF EXISTS "Anyone can submit" ON public.form_submissions;
CREATE POLICY "Public and users can submit" ON public.form_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    -- Anonymous submissions must not claim a user_id
    (auth.uid() IS NULL AND user_id IS NULL)
    OR
    -- Authenticated users may only submit under their own id (or no id)
    (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  );

-- portfolio_projects
DROP POLICY IF EXISTS "Admins manage projects" ON public.portfolio_projects;
CREATE POLICY "Admins manage projects" ON public.portfolio_projects
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- profiles
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Add self-insert/update for profiles (fixes profiles_no_insert_policy)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- storage.objects policies (admin management for product-images)
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Fix SUPA_public_bucket_allows_listing:
-- Drop broad SELECT policy — the bucket is marked public, so /storage/v1/object/public/... URLs
-- keep working via the CDN without needing an RLS SELECT policy on storage.objects.
DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;

-- 3. Drop the old public.has_role now that no policy references it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
