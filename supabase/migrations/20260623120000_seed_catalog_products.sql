-- Seed dos produtos exibidos na home (catálogo Bethel)
INSERT INTO public.products (name, slug, description, category_id, images, sort_order, active)
SELECT v.name, v.slug, v.description, c.id, v.images::jsonb, v.sort_order, true
FROM (VALUES
  (
    'Banco Articulado 70x45',
    'banco-articulado-70x45',
    'Assento articulado em inox desenvolvido para proporcionar mais segurança, acessibilidade e conforto em ambientes adaptados. Ideal para banheiros acessíveis, oferece resistência, durabilidade e excelente acabamento.',
    'barra-de-apoio',
    '["asset:produto-assento-articulado.jpg"]',
    10
  ),
  (
    'Suporte Lateral de Lavatório',
    'suporte-lateral-de-lavatorio',
    'Barra de apoio em formato "U", fabricada para oferecer maior estabilidade, apoio e segurança ao usuário. Indicada para banheiros acessíveis e espaços adaptados, com estrutura resistente e acabamento de alta qualidade.',
    'barra-de-apoio',
    '["asset:produto-barra-u.jpg"]',
    20
  ),
  (
    'Barra Reta de Apoio',
    'barra-reta-de-apoio',
    'Barra de apoio reta produzida com alta resistência e excelente acabamento. Indicada para auxiliar na mobilidade e dar mais segurança em áreas acessíveis, atendendo diferentes necessidades de instalação.',
    'barra-de-apoio',
    '["asset:produto-barra-reta-1.jpg"]',
    30
  ),
  (
    'Elemento Tátil PVC',
    'elemento-tatil-pvc',
    'Elemento Tátil em PVC, leve e resistente, ideal para garantir acessibilidade com ótimo custo-benefício. Fácil de instalar, possui boa durabilidade e proporciona orientação segura em diversos ambientes.',
    'elemento-tatil',
    '["asset:produto-alarme-pcd.jpg"]',
    40
  ),
  (
    'Elemento Tátil Inox Adesivado',
    'elemento-tatil-inox-adesivado',
    'Elemento Tátil em inox adesivado, prático e de fácil instalação, ideal para garantir acessibilidade sem necessidade de perfuração. Resistente e com acabamento moderno, oferece ótima aderência e durabilidade para uso em diversos ambientes.',
    'elemento-tatil',
    '["asset:produto-chapa-inox.jpg"]',
    50
  ),
  (
    'Elemento Tátil Inox',
    'elemento-tatil-inox',
    'Elemento Tátil em inox de alta durabilidade, ideal para garantir acessibilidade e segurança em ambientes internos e externos. Resistente à corrosão, possui acabamento moderno e excelente fixação, proporcionando orientação eficiente e longa vida útil.',
    'piso-tatil-inox',
    '["asset:produto-placa-inox-1.jpg"]',
    60
  ),
  (
    'Piso Tátil Concreto',
    'piso-tatil-concreto',
    'Piso tátil em concreto, robusto e altamente resistente, ideal para áreas externas. Garante acessibilidade com segurança, suportando alto fluxo e variações climáticas com excelente durabilidade.',
    'piso-tatil-concreto',
    '["asset:produto-piso-tatil-direcional-alerta.jpg"]',
    70
  ),
  (
    'Elemento Tátil Inox com Parafuso',
    'elemento-tatil-inox-com-parafuso',
    'Elemento tátil em inox com fixação por parafuso, garantindo máxima firmeza e segurança. Ideal para locais de alto fluxo, oferece alta durabilidade, resistência e acabamento moderno.',
    'piso-tatil-inox',
    '["asset:produto-placa-inox-2.jpg"]',
    80
  ),
  (
    'Placa em Braille – Sanitário PNE / Unissex',
    'placa-em-braille-sanitario-pne-unissex',
    'Placa de sinalização em braille para sanitário PNE e unissex, produzida para garantir identificação acessível, leitura tátil e comunicação inclusiva em ambientes adaptados. Produto com acabamento profissional e excelente legibilidade.',
    'braille',
    '["asset:produto-placa-braille-pne.jpg"]',
    90
  ),
  (
    'Sinalizador de Degrau Fotoluminescente',
    'sinalizador-de-degrau-fotoluminescente',
    'Sinalizador de degrau fotoluminescente, ideal para aumentar a segurança em escadas e desníveis. Brilha no escuro após exposição à luz, garantindo visibilidade mesmo em falta de energia, com fácil aplicação e alta durabilidade.',
    'faixa-de-sinalizacao-acessibilidade',
    '["asset:produto-fita-fotoluminescente-sinalizacao.jpg"]',
    100
  ),
  (
    'Piso Tátil de PVC',
    'piso-tatil-de-pvc',
    'Piso Tátil de PVC desenvolvido para proporcionar acessibilidade e segurança em diversos ambientes. Fabricado com material resistente e antiderrapante, oferece fácil instalação, alta durabilidade e excelente acabamento para áreas internas e externas.',
    'piso-tatil-pvc',
    '["asset:produto-piso-tatil-pvc.jpg"]',
    110
  )
) AS v(name, slug, description, category_slug, images, sort_order)
JOIN public.categories c ON c.slug = v.category_slug
ON CONFLICT (slug) DO NOTHING;
