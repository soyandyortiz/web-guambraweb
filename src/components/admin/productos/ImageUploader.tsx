"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2, AlertCircle, GripVertical } from "lucide-react";

const MAX_IMAGES = 5;
const MIN_IMAGES = 0; // 0 = no requerido

interface ImageUploaderProps {
  /** URLs actuales (pueden ser URLs externas o de storage) */
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ value, onChange, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<number | null>(null); // índice del slot subiendo
  const [errors, setErrors] = useState<string[]>([]);
  const [draggingOver, setDraggingOver] = useState(false);

  const addError = (msg: string) => {
    setErrors((e) => [...e, msg]);
    setTimeout(() => setErrors((e) => e.slice(1)), 4000);
  };

  const uploadFile = useCallback(
    async (file: File, slotIndex: number) => {
      setUploading(slotIndex);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok || json.error) {
          addError(json.error ?? "Error al subir imagen");
          return;
        }
        const newUrls = [...value];
        newUrls[slotIndex] = json.url;
        onChange(newUrls);
      } finally {
        setUploading(null);
      }
    },
    [value, onChange]
  );

  const handleFileSelect = (files: FileList | null, slotIndex?: number) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const idx = slotIndex !== undefined ? slotIndex : value.length;
    if (idx >= MAX_IMAGES) {
      addError(`Máximo ${MAX_IMAGES} imágenes permitidas`);
      return;
    }
    uploadFile(file, idx);
  };

  const removeImage = (idx: number) => {
    const newUrls = value.filter((_, i) => i !== idx);
    onChange(newUrls);
  };

  const slots = Array.from({ length: MAX_IMAGES });

  return (
    <div className="space-y-3">
      {/* Título y contador */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
          Imágenes del Producto
          <span className="ml-1.5 text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>
            (máx. {MAX_IMAGES})
          </span>
        </label>
        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          {value.length}/{MAX_IMAGES}
        </span>
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Grid de slots */}
      <div className="grid grid-cols-5 gap-2">
        {slots.map((_, idx) => {
          const url = value[idx];
          const isLoading = uploading === idx;
          const isFilled = !!url;
          const isNext = idx === value.length && value.length < MAX_IMAGES;

          return (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden transition-all duration-200 group"
              style={{
                border: isNext && draggingOver
                  ? "2px dashed hsl(var(--primary))"
                  : isFilled
                  ? "2px solid hsl(var(--border))"
                  : "2px dashed hsl(var(--border))",
                background: isFilled
                  ? "transparent"
                  : "hsl(var(--muted) / 0.3)",
                cursor: isFilled || isLoading ? "default" : idx <= value.length ? "pointer" : "not-allowed",
                opacity: idx > value.length ? 0.4 : 1,
              }}
              onClick={() => {
                if (!isFilled && !isLoading && idx <= value.length && !disabled) {
                  inputRef.current!.setAttribute("data-slot", String(idx));
                  inputRef.current!.click();
                }
              }}
              onDragOver={(e) => {
                if (isNext) { e.preventDefault(); setDraggingOver(true); }
              }}
              onDragLeave={() => setDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDraggingOver(false);
                if (isNext) handleFileSelect(e.dataTransfer.files, idx);
              }}
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center"
                     style={{ background: "hsl(var(--muted) / 0.6)" }}>
                  <Loader2 size={20} className="animate-spin" style={{ color: "hsl(var(--primary))" }} />
                </div>
              ) : isFilled ? (
                <>
                  <Image
                    src={url}
                    alt={`Imagen ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                    unoptimized={url.startsWith("http")}
                  />
                  {/* Overlay con botón eliminar */}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center
                                 opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-150 shadow-md"
                      style={{ background: "hsl(var(--destructive))", color: "white" }}
                      title="Eliminar imagen"
                    >
                      <X size={14} />
                    </button>
                  )}
                  {/* Badge número */}
                  <div
                    className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold"
                    style={{ background: "rgba(0,0,0,0.55)", color: "white", fontSize: "10px" }}
                  >
                    {idx + 1}
                  </div>
                </>
              ) : idx <= value.length ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  {idx === 0 ? (
                    <>
                      <Upload size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
                      <span style={{ fontSize: "9px", color: "hsl(var(--muted-foreground))" }}>Subir</span>
                    </>
                  ) : (
                    <ImageIcon size={14} style={{ color: "hsl(var(--border))" }} />
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Botón de carga principal */}
      {value.length < MAX_IMAGES && !disabled && (
        <button
          type="button"
          onClick={() => {
            const nextSlot = value.length;
            if (nextSlot < MAX_IMAGES) {
              inputRef.current!.click();
            }
          }}
          className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2
                     transition-all duration-200 hover:opacity-80"
          style={{
            border: "1.5px dashed hsl(var(--primary) / 0.5)",
            background: "hsl(var(--primary) / 0.04)",
            color: "hsl(var(--primary))",
          }}
        >
          <Upload size={15} />
          {value.length === 0
            ? "Subir imagen desde el equipo"
            : `Agregar imagen (${value.length}/${MAX_IMAGES})`}
        </button>
      )}

      {/* Hint URL manual */}
      <div>
        <p className="text-xs mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          O ingresa URL directamente:
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            className="input text-sm flex-1"
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={value.length >= MAX_IMAGES || disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const input = e.currentTarget;
                const url = input.value.trim();
                if (url && value.length < MAX_IMAGES) {
                  onChange([...value, url]);
                  input.value = "";
                } else if (value.length >= MAX_IMAGES) {
                  addError(`Máximo ${MAX_IMAGES} imágenes permitidas`);
                }
              }
            }}
          />
          <button
            type="button"
            className="btn-ghost px-3 text-sm"
            disabled={value.length >= MAX_IMAGES || disabled}
            onClick={(e) => {
              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
              const url = input?.value.trim();
              if (url && value.length < MAX_IMAGES) {
                onChange([...value, url]);
                input.value = "";
              }
            }}
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Errores */}
      {errors.map((err, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs animate-fade-in"
          style={{
            background: "hsl(var(--destructive) / 0.1)",
            border: "1px solid hsl(var(--destructive) / 0.3)",
            color: "hsl(var(--destructive))",
          }}
        >
          <AlertCircle size={13} />
          {err}
        </div>
      ))}

      {/* Hint informativo */}
      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        JPEG, PNG, WebP o GIF · Máx. 5 MB por imagen · La primera imagen es la principal
      </p>
    </div>
  );
}
