"use client";

import { useState } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setActiveIdx((i) => (i < images.length - 1 ? i + 1 : 0));

  if (images.length === 0) {
    return (
      <div
        className="rounded-2xl border aspect-square flex flex-col items-center justify-center opacity-40"
        style={{
          borderColor: "hsl(var(--border))",
          background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--background)))",
        }}
      >
        <ShoppingBag size={80} className="mb-4" />
        <span className="text-sm font-medium">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div
        className="relative rounded-2xl border overflow-hidden aspect-square"
        style={{
          borderColor: "hsl(var(--border))",
          background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--background)))",
        }}
      >
        <img
          src={images[activeIdx]}
          alt={`${productName} — imagen ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Flechas de navegación (solo si hay más de una imagen) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center
                         transition-all duration-150 hover:scale-110"
              style={{ background: "hsl(var(--card) / 0.85)", color: "hsl(var(--foreground))", backdropFilter: "blur(6px)" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center
                         transition-all duration-150 hover:scale-110"
              style={{ background: "hsl(var(--card) / 0.85)", color: "hsl(var(--foreground))", backdropFilter: "blur(6px)" }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Indicador de posición */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: "rgba(0,0,0,0.55)", color: "white" }}
            >
              {activeIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas (solo si hay más de una imagen) */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className="aspect-square rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: idx === activeIdx
                  ? "2px solid hsl(var(--primary))"
                  : "2px solid hsl(var(--border))",
                opacity: idx === activeIdx ? 1 : 0.6,
                transform: idx === activeIdx ? "scale(1)" : "scale(0.95)",
              }}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <img
                src={url}
                alt={`${productName} — miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default ProductGallery;
