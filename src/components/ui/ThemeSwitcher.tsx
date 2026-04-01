"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Palette, Check } from "lucide-react";
import { useState } from "react";

export function ThemeSwitcher() {
  const { availableThemes, themeName, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost p-2 rounded-lg"
        title="Cambiar tema"
      >
        <Palette size={18} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="card absolute right-0 top-full mt-2 w-52 p-2 z-50 animate-scale-in"
            style={{ minWidth: "13rem" }}
          >
            <p className="text-xs font-semibold px-2 pb-2"
               style={{ color: "hsl(var(--muted-foreground))" }}>
              Tema Visual
            </p>
            {availableThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => { setTheme(theme.name); setOpen(false); }}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all duration-150"
                style={{
                  background: themeName === theme.name
                    ? "hsl(var(--primary) / 0.1)"
                    : "transparent",
                  color: "hsl(var(--foreground))",
                }}
              >
                {/* Preview dot */}
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 border-2"
                  style={{
                    background: `hsl(${theme.colors.primary})`,
                    borderColor: themeName === theme.name
                      ? `hsl(${theme.colors.primary})`
                      : "transparent",
                  }}
                />
                <span className="flex-1 text-left">{theme.label}</span>
                {themeName === theme.name && (
                  <Check size={14} style={{ color: "hsl(var(--primary))" }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
