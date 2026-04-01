"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  value: string;
  label?: string;
}

export default function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all text-xs font-medium border border-primary/20 group"
      title={label || "Copiar al portapapeles"}
    >
      {copied ? (
        <>
          <Check size={14} className="animate-in zoom-in" />
          <span>¡Copiado!</span>
        </>
      ) : (
        <>
          <Copy size={14} className="group-hover:scale-110 transition-transform" />
          <span>{label || "Copiar"}</span>
        </>
      )}
    </button>
  );
}
