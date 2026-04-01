import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GuambraWeb — Links",
  description:
    "Agencia de Desarrollo Web & Sistemas en Ecuador. Todos nuestros links en un solo lugar.",
  icons: {
    icon: "/icono.svg",
    apple: "/icono.svg",
  },
  openGraph: {
    title: "GuambraWeb — Links",
    description: "Desarrollo Web, Sistemas y Portafolio de proyectos.",
    url: "https://bio.guambraweb.com",
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
    title: "GuambraWeb — Links",
    description: "Desarrollo Web, Sistemas y Portafolio de proyectos.",
    images: ["/social-media.png"],
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
