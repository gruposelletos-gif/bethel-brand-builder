import {
  Facebook,
  Instagram,
  Link2,
  Linkedin,
  LucideIcon,
  Twitter,
  Youtube,
} from "lucide-react";
import { createElement } from "react";

export interface FooterSocialLink {
  id: string;
  label: string;
  url: string;
  icon: FooterSocialIcon;
}

export type FooterSocialIcon =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "twitter"
  | "tiktok"
  | "link";

export const FOOTER_SOCIAL_ICON_OPTIONS: { value: FooterSocialIcon; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "tiktok", label: "TikTok" },
  { value: "link", label: "Link genérico" },
];

const TikTokIcon = ({ size = 18, className }: { size?: number; className?: string }) =>
  createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      "aria-hidden": true,
    },
    createElement("path", {
      d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .55.04.8.12V9.01a6.27 6.27 0 0 0-.8-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z",
    }),
  );

export const footerSocialIconMap: Record<FooterSocialIcon, LucideIcon | typeof TikTokIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: TikTokIcon,
  link: Link2,
};

export const createFooterSocialLink = (
  partial?: Partial<FooterSocialLink>,
): FooterSocialLink => ({
  id: partial?.id ?? crypto.randomUUID(),
  label: partial?.label ?? "",
  url: partial?.url ?? "",
  icon: partial?.icon ?? "link",
});

/** Redes exibidas no rodapé original (Instagram, Facebook, LinkedIn). */
export const DEFAULT_FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  createFooterSocialLink({
    id: "footer-social-instagram",
    label: "Instagram",
    icon: "instagram",
    url: "https://www.instagram.com/bethelacessibilidade/",
  }),
  createFooterSocialLink({
    id: "footer-social-facebook",
    label: "Facebook",
    icon: "facebook",
    url: "https://www.facebook.com/bethelacessibilidade",
  }),
  createFooterSocialLink({
    id: "footer-social-linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    url: "https://www.linkedin.com/company/bethel-acessibilidade/",
  }),
];

export const parseFooterSocialLinks = (value: unknown): FooterSocialLink[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const url = typeof row.url === "string" ? row.url.trim() : "";
      if (!url) return null;

      const icon = FOOTER_SOCIAL_ICON_OPTIONS.some((o) => o.value === row.icon)
        ? (row.icon as FooterSocialIcon)
        : "link";

      return {
        id: typeof row.id === "string" ? row.id : crypto.randomUUID(),
        label: typeof row.label === "string" && row.label.trim() ? row.label.trim() : "Rede social",
        url,
        icon,
      };
    })
    .filter((item): item is FooterSocialLink => item !== null);
};

export const legacySocialLinks = (data: {
  social_instagram?: string | null;
  social_facebook?: string | null;
  social_linkedin?: string | null;
}): FooterSocialLink[] => {
  const items: FooterSocialLink[] = [];
  if (data.social_instagram?.trim()) {
    items.push(createFooterSocialLink({ label: "Instagram", icon: "instagram", url: data.social_instagram }));
  }
  if (data.social_facebook?.trim()) {
    items.push(createFooterSocialLink({ label: "Facebook", icon: "facebook", url: data.social_facebook }));
  }
  if (data.social_linkedin?.trim()) {
    items.push(createFooterSocialLink({ label: "LinkedIn", icon: "linkedin", url: data.social_linkedin }));
  }
  return items;
};
