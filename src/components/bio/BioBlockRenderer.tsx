"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  Globe, Instagram, Facebook, Linkedin, Youtube, Mail, Phone,
  Github, ShoppingCart, MessageCircle, Music2, Video, Twitter, ExternalLink,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Instagram, Facebook, Linkedin, Youtube, Mail, Phone,
  Github, ShoppingCart, MessageCircle, Music2, Video, Twitter, ExternalLink,
};

interface BioBlock {
  id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  url: string | null;
  image_url: string | null;
  icon_name: string | null;
  bg_color: string | null;
  text_color: string | null;
  is_active: boolean;
  sort_order: number;
  clicks: number;
}

interface Props {
  block: BioBlock;
  template: string;
  textColor: string;
  subColor: string;
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const ytMatch =
      u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be");
    if (ytMatch) {
      let videoId = u.searchParams.get("v");
      if (!videoId && u.hostname === "youtu.be") videoId = u.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

async function trackClick(id: string) {
  try {
    await fetch(`/api/bio/track-click/${id}`, { method: "POST" });
  } catch {
    // ignore
  }
}

// ── Button block (needs its own state for expand/collapse) ──────────
function ButtonBlock({
  block,
  textColor,
  subColor,
}: {
  block: BioBlock;
  textColor: string;
  subColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[block.icon_name ?? "Globe"] ?? Globe;
  const bgColor = block.bg_color ?? "#4361ee";
  const txtColor = block.text_color ?? "#ffffff";
  const hasContent = !!block.content?.replace(/<[^>]*>/g, "").trim();

  return (
    <div className="w-full">
      {/* Main button row */}
      <div
        className="flex items-center gap-3 w-full px-5 py-3.5 font-semibold text-sm shadow-sm transition-all hover:brightness-95 active:scale-[0.99]"
        style={{
          background: bgColor,
          color: txtColor,
          borderRadius: hasContent && expanded ? "1rem 1rem 0 0" : "1rem",
        }}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />

        {/* Title — clickable link if URL present */}
        {block.url ? (
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(block.id)}
            className="flex-1 text-center"
            style={{ color: txtColor }}
          >
            {block.title}
          </a>
        ) : (
          <span className="flex-1 text-center">{block.title}</span>
        )}

        {/* Expand chevron — only when there is collapsible content */}
        {hasContent && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 transition-all hover:opacity-80"
            style={{ color: txtColor }}
            aria-label={expanded ? "Cerrar" : "Expandir"}
          >
            <ChevronDown
              size={17}
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        )}
      </div>

      {/* Collapsible content panel */}
      {hasContent && expanded && (
        <div
          className="px-5 py-4 text-sm leading-relaxed bio-rich"
          style={{
            background: `${bgColor}18`,
            border: `1px solid ${bgColor}35`,
            borderTop: "none",
            borderRadius: "0 0 1rem 1rem",
            color: textColor,
          }}
          dangerouslySetInnerHTML={{ __html: block.content ?? "" }}
        />
      )}
    </div>
  );
}

// ── Main renderer ────────────────────────────────────────────────────
export function BioBlockRenderer({ block, template, textColor, subColor }: Props) {
  if (!block.is_active) return null;

  const isDark = template === "dark" || template === "gradient";

  // ── BUTTON ────────────────────────────────────────────────────────
  if (block.type === "button") {
    return (
      <ButtonBlock block={block} textColor={textColor} subColor={subColor} />
    );
  }

  // ── CARD ──────────────────────────────────────────────────────────
  if (block.type === "card") {
    const cardBg = isDark
      ? "rgba(255,255,255,0.07)"
      : "rgba(0,0,0,0.04)";
    const border = isDark
      ? "1px solid rgba(255,255,255,0.12)"
      : "1px solid rgba(0,0,0,0.08)";

    const inner = (
      <div
        className="w-full rounded-2xl overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: cardBg, border }}
        onClick={block.url ? () => trackClick(block.id) : undefined}
      >
        {block.image_url && (
          <div className="relative w-full h-36 overflow-hidden">
            <Image
              src={block.image_url}
              alt={block.title ?? ""}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          {block.title && (
            <p
              className="font-semibold text-sm mb-0.5"
              style={{ color: textColor }}
            >
              {block.title}
            </p>
          )}
          {block.subtitle && (
            <p className="text-xs font-medium mb-1" style={{ color: subColor }}>
              {block.subtitle}
            </p>
          )}
          {block.content && (
            <p className="text-xs leading-relaxed" style={{ color: subColor }}>
              {block.content}
            </p>
          )}
        </div>
      </div>
    );

    if (block.url) {
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block"
        >
          {inner}
        </a>
      );
    }
    return <div className="w-full">{inner}</div>;
  }

  // ── TEXT ──────────────────────────────────────────────────────────
  if (block.type === "text") {
    return (
      <div className="w-full px-2">
        {block.title && (
          <p className="font-bold text-base mb-2" style={{ color: textColor }}>
            {block.title}
          </p>
        )}
        {block.content && (
          <div
            className="text-sm leading-relaxed bio-rich"
            style={{ color: subColor }}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )}
      </div>
    );
  }

  // ── VIDEO ─────────────────────────────────────────────────────────
  if (block.type === "video") {
    const embedUrl = block.content ? getEmbedUrl(block.content) : null;
    if (!embedUrl) return null;

    return (
      <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {block.title && (
          <p className="text-xs font-medium mb-2" style={{ color: subColor }}>
            {block.title}
          </p>
        )}
        <iframe
          src={embedUrl}
          className="w-full h-full"
          style={{ border: "none", borderRadius: "1rem" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={block.title ?? "Video"}
        />
      </div>
    );
  }

  // ── DIVIDER ───────────────────────────────────────────────────────
  if (block.type === "divider") {
    const lineColor = isDark
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.1)";
    if (block.title) {
      return (
        <div className="flex items-center gap-3 w-full py-1">
          <div className="flex-1 h-px" style={{ background: lineColor }} />
          <span
            className="text-xs font-medium px-2"
            style={{ color: subColor }}
          >
            {block.title}
          </span>
          <div className="flex-1 h-px" style={{ background: lineColor }} />
        </div>
      );
    }
    return (
      <div className="w-full h-px my-1" style={{ background: lineColor }} />
    );
  }

  return null;
}
