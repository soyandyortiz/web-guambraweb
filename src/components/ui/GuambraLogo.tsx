type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const ICON_SIZES: Record<LogoSize, string> = {
  xs: "h-6",
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-16",
};

interface GuambraLogoProps {
  size?: LogoSize;
  className?: string;
}

export function GuambraLogo({ size = "md", className = "" }: GuambraLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icono.svg"
      alt="GuambraWeb"
      className={`${ICON_SIZES[size]} w-auto ${className}`}
    />
  );
}

/** Solo el icono — para sidebar colapsado, bio avatar, etc. */
export function GuambraIcon({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icono.svg" alt="GuambraWeb" className={`w-auto ${className}`} />;
}
