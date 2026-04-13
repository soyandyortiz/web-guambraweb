export type ThemeColors = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  sidebarBg: string;
  sidebarForeground: string;
  sidebarAccent: string;
  sidebarBorder: string;
};

export type ThemeTypography = {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
};

export type Theme = {
  name: string;
  label: string;
  colors: ThemeColors;
  typography: ThemeTypography;
};

export const themes: Record<string, Theme> = {
  perla: {
    name: "perla",
    label: "Perla",
    typography: {
      fontSans: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontSerif: "'Georgia', 'Times New Roman', serif",
      fontMono: "'SF Mono', 'JetBrains Mono', 'Menlo', 'Consolas', monospace",
    },
    colors: {
      primary: "214 100% 44%",           // #0071e3 — Apple blue
      primaryForeground: "0 0% 100%",
      secondary: "220 10% 46%",          // cool gray secondary
      secondaryForeground: "0 0% 100%",
      accent: "214 100% 44%",
      accentForeground: "0 0% 100%",
      background: "220 14% 97%",         // very light cool-gray tint
      foreground: "220 15% 14%",         // near-black with slight blue tint
      card: "0 0% 100%",                 // white cards on tinted bg
      cardForeground: "220 15% 14%",
      border: "220 10% 88%",             // light cool border
      input: "220 10% 94%",
      ring: "214 100% 44%",
      muted: "220 10% 94%",
      mutedForeground: "220 10% 46%",
      destructive: "0 84% 50%",
      destructiveForeground: "0 0% 100%",
      success: "142 60% 35%",
      successForeground: "0 0% 100%",
      warning: "38 92% 42%",
      warningForeground: "0 0% 100%",
      sidebarBg: "220 14% 98%",
      sidebarForeground: "220 15% 20%",
      sidebarAccent: "214 100% 44%",
      sidebarBorder: "220 10% 90%",
    },
  },
};


export const defaultTheme = "perla";

export function generateCSSVariables(theme: Theme): string {
  const { colors, typography } = theme;
  return `
  --primary: ${colors.primary};
  --primary-foreground: ${colors.primaryForeground};
  --secondary: ${colors.secondary};
  --secondary-foreground: ${colors.secondaryForeground};
  --accent: ${colors.accent};
  --accent-foreground: ${colors.accentForeground};
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  --card: ${colors.card};
  --card-foreground: ${colors.cardForeground};
  --border: ${colors.border};
  --input: ${colors.input};
  --ring: ${colors.ring};
  --muted: ${colors.muted};
  --muted-foreground: ${colors.mutedForeground};
  --destructive: ${colors.destructive};
  --destructive-foreground: ${colors.destructiveForeground};
  --success: ${colors.success};
  --success-foreground: ${colors.successForeground};
  --warning: ${colors.warning};
  --warning-foreground: ${colors.warningForeground};
  --sidebar-bg: ${colors.sidebarBg};
  --sidebar-foreground: ${colors.sidebarForeground};
  --sidebar-accent: ${colors.sidebarAccent};
  --sidebar-border: ${colors.sidebarBorder};
  --font-sans: ${typography.fontSans};
  --font-serif: ${typography.fontSerif};
  --font-mono: ${typography.fontMono};
  `;
}
