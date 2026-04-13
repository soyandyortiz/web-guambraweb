import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { MouseGlow, InteractiveGrid } from "@/components/ui/InteractiveEffects";
import SchemaMarkup from "@/components/seo/SchemaMarkup";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://guambraweb.com",
  ),
  title: {
    default: "GuambraWeb | Expertos en Desarrollo de Software y Web",
    template: "%s | GuambraWeb",
  },
  description:
    "GuambraWeb: Tu socio tecnológico experto en desarrollo de software, aplicaciones web y sistemas de gestión empresarial. Optimizamos tu presencia digital con soluciones a medida.",
  keywords: [
    "Desarrollo de Software Riobamba",
    "Páginas Web Riobamba",
    "Sistemas de Gestión Ecuador",
    "Agencia de Software",
    "Aplicaciones Web a medida",
    "Diseño web profesional",
    "SEO Next.js",
  ],
  authors: [{ name: "GuambraWeb", url: "https://guambraweb.com" }],
  creator: "GuambraWeb",
  publisher: "GuambraWeb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "https://guambraweb.com",
    title: "GuambraWeb | Desarrollo de Software y Soluciones Digitales",
    description:
      "Transformamos ideas en productos digitales de alto rendimiento. Especialistas en Next.js, sistemas cloud y ecommerce.",
    siteName: "GuambraWeb",
    images: [
      {
        url: "/social-media.png",
        width: 1200,
        height: 630,
        alt: "GuambraWeb - Innovación en Desarrollo de Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GuambraWeb | Desarrollo de Software y Soluciones Digitales",
    description:
      "Transformamos ideas en productos digitales de alto rendimiento. Especialistas en Next.js y sistemas cloud.",
    images: ["/social-media.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://guambraweb.com",
  },
  icons: {
    icon: "/icono.svg",
    apple: "/icono.svg",
    shortcut: "/icono.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GuambraWeb",
  },
  manifest: "/manifest.json",
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guambraweb.com";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Blocking script to prevent white flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const themeName = localStorage.getItem('guambra-theme') || 'blanco';
                  const colorMap = {
                    blanco: {
                      '--primary': '214 100% 44%',
                      '--background': '0 0% 100%',
                      '--foreground': '0 0% 11%',
                    },
                    perla: {
                      '--primary': '214 100% 44%',
                      '--background': '220 14% 97%',
                      '--foreground': '220 15% 14%',
                    }
                  };
                  const colors = colorMap[themeName] || colorMap.blanco;
                  for (const key in colors) {
                    document.documentElement.style.setProperty(key, colors[key]);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Schema Markup JSON-LD inyectado globalmente */}
        <SchemaMarkup baseUrl={baseUrl} />
      </head>
      <body className="antialiased">
        <CartProvider>
          <ThemeProvider>
            <InteractiveGrid />
            <MouseGlow />
            {children}
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
