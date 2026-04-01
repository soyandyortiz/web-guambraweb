"use client";

import { Eye, MousePointerClick, TrendingUp } from "lucide-react";

interface BlockStat {
  id: string;
  title: string | null;
  type: string;
  clicks: number;
}

interface Props {
  totalVisits: number;
  blocks: BlockStat[];
}

const TYPE_LABELS: Record<string, string> = {
  button: "Botón",
  card: "Card",
  text: "Texto",
  video: "Video",
  divider: "Divisor",
};

export function AnalyticsDashboard({ totalVisits, blocks }: Props) {
  const totalClicks = blocks.reduce((s, b) => s + b.clicks, 0);
  const ctr = totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : "0.0";

  const cardStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "1rem",
    padding: "1rem",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div style={cardStyle} className="flex flex-col items-center text-center gap-1">
          <Eye size={20} style={{ color: "hsl(var(--primary))" }} />
          <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            {totalVisits.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Visitas
          </p>
        </div>
        <div style={cardStyle} className="flex flex-col items-center text-center gap-1">
          <MousePointerClick size={20} style={{ color: "hsl(var(--primary))" }} />
          <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            {totalClicks.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Clics totales
          </p>
        </div>
        <div style={cardStyle} className="flex flex-col items-center text-center gap-1">
          <TrendingUp size={20} style={{ color: "hsl(var(--primary))" }} />
          <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            {ctr}%
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            CTR
          </p>
        </div>
      </div>

      {/* Per-block table */}
      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
            Rendimiento por bloque
          </p>
        </div>
        {blocks.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            Sin datos aún
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {blocks.map((b) => {
              const rate = totalVisits > 0 ? ((b.clicks / totalVisits) * 100).toFixed(1) : "0.0";
              const pct = totalClicks > 0 ? (b.clicks / totalClicks) * 100 : 0;
              return (
                <div key={b.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>
                      {b.title ?? "(sin título)"}
                    </p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {TYPE_LABELS[b.type] ?? b.type}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                      {b.clicks}
                      <span className="text-xs font-normal ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                        clics
                      </span>
                    </p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {rate}% CTR
                    </p>
                  </div>
                  {/* Bar */}
                  <div
                    className="w-16 h-1.5 rounded-full overflow-hidden flex-shrink-0"
                    style={{ background: "hsl(var(--muted))" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        background: "hsl(var(--primary))",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
