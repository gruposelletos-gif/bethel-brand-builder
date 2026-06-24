import { supabase } from "@/integrations/supabase/client";
import { imageUrl } from "@/lib/products";
import {
  DEFAULT_FOOTER_SOCIAL_LINKS,
  FooterSocialLink,
  legacySocialLinks,
  parseFooterSocialLinks,
} from "@/lib/footer-social";
import defaultLogo from "@/assets/logo-bethel.png";

export interface FooterSettings {
  logo_path: string | null;
  description: string;
  phone: string;
  phone_link: string;
  email: string;
  address: string;
  address_link: string;
  social_links: FooterSocialLink[];
  credit_url: string;
  credit_label: string;
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  logo_path: null,
  description:
    "Comércio de produtos de acessibilidade e prestação de serviços com qualidade e excelência.",
  phone: "(11) 9 9162-8441",
  phone_link: "https://wa.me/5511991628441",
  email: "vendas@bethel.ind.br",
  address:
    "Rua Francisco de Souza Dias Guimaraes, 80 — Centro Industrial Rafael Diniz — Bragança Paulista/SP",
  address_link:
    "https://www.google.com/maps/search/?api=1&query=Rua+Francisco+de+Souza+Dias+Guimaraes+80+Centro+Industrial+Rafael+Diniz+Bragança+Paulista+SP",
  social_links: DEFAULT_FOOTER_SOCIAL_LINKS,
  credit_url: "https://selletos.com.br",
  credit_label: "selletos.com.br",
};

export const footerLogoSrc = (logoPath: string | null) =>
  logoPath ? imageUrl(logoPath) : defaultLogo;

export const fetchFooterSettings = async (): Promise<FooterSettings> => {
  const { data, error } = await supabase
    .from("footer_settings")
    .select(
      "logo_path, description, phone, phone_link, email, address, address_link, social_links, social_instagram, social_facebook, social_linkedin, credit_url, credit_label",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return DEFAULT_FOOTER_SETTINGS;

  const parsedLinks = parseFooterSocialLinks(data.social_links);
  const legacyLinks = legacySocialLinks({
    social_instagram: data.social_instagram,
    social_facebook: data.social_facebook,
    social_linkedin: data.social_linkedin,
  });
  const social_links =
    parsedLinks.length > 0
      ? parsedLinks
      : legacyLinks.length > 0
        ? legacyLinks
        : DEFAULT_FOOTER_SOCIAL_LINKS;

  return {
    logo_path: data.logo_path,
    description: data.description,
    phone: data.phone,
    phone_link: data.phone_link,
    email: data.email,
    address: data.address,
    address_link: data.address_link,
    social_links,
    credit_url: data.credit_url,
    credit_label: data.credit_label,
  };
};

export const saveFooterSettings = async (settings: FooterSettings) => {
  const social_links = settings.social_links
    .map((item) => ({
      id: item.id,
      label: item.label.trim() || "Rede social",
      url: item.url.trim(),
      icon: item.icon,
    }))
    .filter((item) => item.url);

  const { error } = await supabase
    .from("footer_settings")
    .update({
      logo_path: settings.logo_path,
      description: settings.description.trim(),
      phone: settings.phone.trim(),
      phone_link: settings.phone_link.trim(),
      email: settings.email.trim(),
      address: settings.address.trim(),
      address_link: settings.address_link.trim(),
      social_links,
      social_instagram: null,
      social_facebook: null,
      social_linkedin: null,
      credit_url: settings.credit_url.trim(),
      credit_label: settings.credit_label.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw error;
};

export const uploadFooterLogo = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `footer/logo-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    upsert: true,
  });
  if (error) throw error;
  return path;
};
