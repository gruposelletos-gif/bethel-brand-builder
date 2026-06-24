-- Preenche as redes sociais padrão (Instagram, Facebook, LinkedIn) do rodapé original
UPDATE public.footer_settings
SET social_links = '[
  {"id":"footer-social-instagram","label":"Instagram","icon":"instagram","url":"https://www.instagram.com/bethelacessibilidade/"},
  {"id":"footer-social-facebook","label":"Facebook","icon":"facebook","url":"https://www.facebook.com/bethelacessibilidade"},
  {"id":"footer-social-linkedin","label":"LinkedIn","icon":"linkedin","url":"https://www.linkedin.com/company/bethel-acessibilidade/"}
]'::jsonb,
updated_at = now()
WHERE id = 1
  AND (social_links IS NULL OR social_links = '[]'::jsonb)
  AND social_instagram IS NULL
  AND social_facebook IS NULL
  AND social_linkedin IS NULL;
