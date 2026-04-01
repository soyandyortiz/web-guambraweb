"use client";

import Image from "next/image";
import {
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  Github,
  ShoppingCart,
  MessageCircle,
  Music2,
  Video,
  Twitter,
  ExternalLink,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  Github,
  ShoppingCart,
  MessageCircle,
  Music2,
  Video,
  Twitter,
  ExternalLink,
};

type BioLink = {
  id: string;
  title: string;
  url: string;
  icon_name: string | null;
  bg_color: string | null;
  text_color: string | null;
};

type BioPortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  project_type: string | null;
};

export function BioLinkCard({ link }: { link: BioLink }) {
  const Icon = ICON_MAP[link.icon_name ?? "Globe"] ?? Globe;
  const bg = link.bg_color ?? "#4361ee";
  const fg = link.text_color ?? "#ffffff";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: bg,
        color: fg,
        boxShadow: `0 4px 20px ${bg}33`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 28px ${bg}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 20px ${bg}33`;
      }}
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        <Icon size={18} />
      </span>
      <span className="flex-1 text-left">{link.title}</span>
      <ArrowRight
        size={16}
        className="opacity-60 group-hover:translate-x-1 transition-transform duration-200"
      />
    </a>
  );
}

export function BioPortfolioCard({ item }: { item: BioPortfolioItem }) {
  return (
    <a
      href={item.url ?? "#"}
      target={item.url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 8px 24px rgba(67,97,238,0.12)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "rgba(67,97,238,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 2px 12px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0";
      }}
    >
      {item.image_url ? (
        <div className="h-36 overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.title}
            width={400}
            height={144}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div
          className="h-24 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(228,100%,60%,0.08), hsl(262,83%,58%,0.08))",
          }}
        >
          <Globe size={32} style={{ color: "hsl(228,100%,60%)", opacity: 0.4 }} />
        </div>
      )}

      <div className="p-4">
        {item.project_type && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
            style={{
              background: "hsl(228,100%,60%,0.08)",
              color: "hsl(228,100%,60%)",
            }}
          >
            {item.project_type}
          </span>
        )}
        <h3 className="font-bold text-sm mb-1" style={{ color: "#0f172a" }}>
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#64748b" }}>
            {item.description}
          </p>
        )}
        {item.url && (
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold mt-2 group-hover:underline"
            style={{ color: "hsl(228,100%,60%)" }}
          >
            Ver proyecto <ExternalLink size={10} />
          </span>
        )}
      </div>
    </a>
  );
}
