"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

type Props = {
  title: string;
  text?: string;
  url?: string; // defaults to current URL
  className?: string;
};

export function ShareButton({ title, text, url, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareData = { title, text: text || title, url: shareUrl };

    // Web Share API — funciona en móvil (WhatsApp, Facebook, etc.)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled — do nothing
        return;
      }
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort
      const el = document.createElement("input");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:opacity-80 active:scale-95 ${className}`}
      style={{
        borderColor: "hsl(var(--border))",
        color: copied ? "hsl(142 71% 40%)" : "hsl(var(--muted-foreground))",
        background: copied ? "hsl(142 71% 40% / 0.08)" : "transparent",
      }}
      title="Compartir"
    >
      {copied ? (
        <>
          <Check size={15} />
          ¡Enlace copiado!
        </>
      ) : (
        <>
          <Share2 size={15} />
          Compartir
        </>
      )}
    </button>
  );
}
