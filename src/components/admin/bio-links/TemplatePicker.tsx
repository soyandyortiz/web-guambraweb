"use client";

export type BioTemplate = "minimal" | "dark" | "gradient";

const TEMPLATES: { id: BioTemplate; label: string; desc: string; preview: string }[] = [
  {
    id: "minimal",
    label: "Minimal",
    desc: "Fondo blanco, limpio y profesional",
    preview: "bg-white border-2 border-gray-200",
  },
  {
    id: "dark",
    label: "Dark",
    desc: "Fondo oscuro con partículas animadas",
    preview: "bg-gray-950 border-2 border-gray-700",
  },
  {
    id: "gradient",
    label: "Gradient",
    desc: "Fondo degradado violeta a azul",
    preview: "bg-gradient-to-br from-violet-600 to-blue-500 border-2 border-violet-400",
  },
];

interface Props {
  value: BioTemplate;
  onChange: (t: BioTemplate) => void;
}

export function TemplatePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-xl p-1 transition-all ${
            value === t.id
              ? "ring-2 ring-offset-2 ring-offset-[hsl(var(--background))] ring-[hsl(var(--primary))]"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          {/* Mini phone preview */}
          <div className={`${t.preview} rounded-lg h-28 w-full flex flex-col items-center justify-center gap-1.5 overflow-hidden`}>
            <div className="w-7 h-7 rounded-full bg-white/30" />
            <div className="w-14 h-1.5 rounded-full bg-white/40" />
            <div className="w-10 h-1 rounded-full bg-white/25" />
            <div className="w-16 h-4 rounded-full bg-white/30 mt-1" />
            <div className="w-16 h-4 rounded-full bg-white/20" />
          </div>
          <p className="text-xs font-semibold mt-2 text-center" style={{ color: "hsl(var(--foreground))" }}>
            {t.label}
          </p>
          <p className="text-[10px] text-center leading-tight" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t.desc}
          </p>
        </button>
      ))}
    </div>
  );
}
