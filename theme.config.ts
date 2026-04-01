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
  negro: {
    name: "negro",
    label: "Negro",
    typography: {
      fontSans: "'Inter', sans-serif",
      fontSerif: "'Family', Georgia, serif",
      fontMono: "'JetBrains Mono', monospace",
    },
    colors: {
      primary: "199 89% 48%", // Ngrok Cyan-Blue
      primaryForeground: "0 0% 100%",
      secondary: "262 83% 58%",
      secondaryForeground: "0 0% 100%",
      accent: "199 89% 48%",
      accentForeground: "0 0% 100%",
      background: "0 0% 7%", // Deep Dark
      foreground: "0 0% 98%",
      card: "0 0% 10%",
      cardForeground: "0 0% 98%",
      border: "0 0% 15%",
      input: "0 0% 12%",
      ring: "199 89% 48%",
      muted: "0 0% 15%",
      mutedForeground: "0 0% 65%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      success: "142 71% 45%",
      successForeground: "0 0% 100%",
      warning: "38 92% 50%",
      warningForeground: "0 0% 10%",
      sidebarBg: "0 0% 5%",
      sidebarForeground: "0 0% 80%",
      sidebarAccent: "199 89% 48%",
      sidebarBorder: "0 0% 12%",
    },
  },
  cian: {
    name: "cian",
    label: "Azul Cian",
    typography: {
      fontSans: "'Inter', sans-serif",
      fontSerif: "'Family', Georgia, serif",
      fontMono: "'JetBrains Mono', monospace",
    },
    colors: {
      primary: "210 10% 60%", // Medium Grey
      primaryForeground: "0 0% 100%",
      secondary: "200 20% 40%",
      secondaryForeground: "0 0% 100%",
      accent: "210 10% 60%",
      accentForeground: "0 0% 100%",
      background: "210 50% 10%", // Deep Navy-Cyan
      foreground: "180 20% 95%",
      card: "210 50% 14%",
      cardForeground: "180 20% 95%",
      border: "210 40% 20%",
      input: "210 40% 18%",
      ring: "210 10% 60%",
      muted: "210 40% 20%",
      mutedForeground: "210 20% 60%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 100%",
      success: "142 71% 45%",
      successForeground: "0 0% 100%",
      warning: "38 92% 50%",
      warningForeground: "0 0% 10%",
      sidebarBg: "210 50% 8%",
      sidebarForeground: "180 20% 80%",
      sidebarAccent: "210 10% 60%",
      sidebarBorder: "210 40% 15%",
    },
  },
};


export const defaultTheme = "negro";

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
