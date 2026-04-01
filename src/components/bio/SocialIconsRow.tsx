"use client";

import { Facebook, Instagram, Youtube, Globe, Twitter } from "lucide-react";

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.8a4.85 4.85 0 0 1-1.07-.11Z" />
    </svg>
  );
}

interface Links {
  facebook:  string | null;
  instagram: string | null;
  tiktok:    string | null;
  x:         string | null;
  youtube:   string | null;
  website:   string | null;
}

interface Props {
  links: Links;
  template: string;
}

const ICON_COLOR: Record<string, string> = {
  minimal:  "#0f172a",
  dark:     "#f8fafc",
  gradient: "#ffffff",
};

const ICONS: { key: keyof Links; Icon: React.ElementType; label: string }[] = [
  { key: "instagram", Icon: Instagram,  label: "Instagram" },
  { key: "facebook",  Icon: Facebook,   label: "Facebook" },
  { key: "tiktok",    Icon: TikTokIcon, label: "TikTok" },
  { key: "x",         Icon: Twitter,    label: "X" },
  { key: "youtube",   Icon: Youtube,    label: "YouTube" },
  { key: "website",   Icon: Globe,      label: "Sitio Web" },
];

export function SocialIconsRow({ links, template }: Props) {
  const color = ICON_COLOR[template] ?? "#0f172a";
  const isDark = template === "dark" || template === "gradient";
  const btnBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  const hoverBg = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";

  const active = ICONS.filter(({ key }) => !!links[key]);
  if (active.length === 0) return null;

  return (
    <div className="flex items-center justify-center flex-wrap gap-2">
      {active.map(({ key, Icon, label }) => (
        <a
          key={key}
          href={links[key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: btnBg, color }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = hoverBg; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = btnBg; }}
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
