ALTER TABLE public.footer_settings
  ADD COLUMN IF NOT EXISTS social_links jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.footer_settings fs
SET social_links = sub.links
FROM (
  SELECT COALESCE(jsonb_agg(item ORDER BY sort_order), '[]'::jsonb) AS links
  FROM (
    SELECT 1 AS sort_order, jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Instagram', 'icon', 'instagram', 'url', social_instagram) AS item
    FROM public.footer_settings WHERE id = 1 AND social_instagram IS NOT NULL AND trim(social_instagram) <> ''
    UNION ALL
    SELECT 2, jsonb_build_object('id', gen_random_uuid()::text, 'label', 'Facebook', 'icon', 'facebook', 'url', social_facebook)
    FROM public.footer_settings WHERE id = 1 AND social_facebook IS NOT NULL AND trim(social_facebook) <> ''
    UNION ALL
    SELECT 3, jsonb_build_object('id', gen_random_uuid()::text, 'label', 'LinkedIn', 'icon', 'linkedin', 'url', social_linkedin)
    FROM public.footer_settings WHERE id = 1 AND social_linkedin IS NOT NULL AND trim(social_linkedin) <> ''
  ) items
) sub
WHERE fs.id = 1
  AND (fs.social_links IS NULL OR fs.social_links = '[]'::jsonb)
  AND sub.links <> '[]'::jsonb;
