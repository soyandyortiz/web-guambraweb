/**
 * GuambraLogo — icono arriba + wordmark abajo (SVGs de /public)
 *
 * Tamaños disponibles:
 *   xs  → icono h-6,  wordmark h-3
 *   sm  → icono h-8,  wordmark h-3.5
 *   md  → icono h-10, wordmark h-4
 *   lg  → icono h-12, wordmark h-5
 *   xl  → icono h-16, wordmark h-6
 */

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, { icon: string; wordmark: string }> = {
  xs: { icon: "h-6",  wordmark: "h-3" },
  sm: { icon: "h-8",  wordmark: "h-3.5" },
  md: { icon: "h-10", wordmark: "h-4" },
  lg: { icon: "h-12", wordmark: "h-5" },
  xl: { icon: "h-16", wordmark: "h-6" },
};

interface GuambraLogoProps {
  size?: LogoSize;
  className?: string;
}

/** Icono + wordmark apilados verticalmente */
export function GuambraLogo({ size = "md", className = "" }: GuambraLogoProps) {
  const s = SIZES[size];
  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icono.svg" alt="" className={`${s.icon} w-auto`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/wordmark.svg" alt="GuambraWeb" className={`${s.wordmark} w-auto`} />
    </div>
  );
}

/** Solo el icono — para sidebar colapsado, bio avatar, etc. */
export function GuambraIcon({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icono.svg" alt="GuambraWeb" className={`w-auto ${className}`} />;
}
