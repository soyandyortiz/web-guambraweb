"use client";

import { FooterLogo } from "./FooterLogo";
import { LegalFooterLinks } from "./LegalModals";

interface FooterProps {
  logoHref?: string;
  className?: string;
}

export function Footer({ logoHref = "/", className = "" }: FooterProps) {
  return (
    <footer
      className={`border-t py-12 transition-colors duration-300 mt-auto ${className}`}
      style={{
        borderColor: "hsl(var(--border))",
        background: "hsl(var(--background))",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 w-full">
          {/* Left: Logo */}
          <div className="flex justify-center md:justify-start">
            <FooterLogo href={logoHref} />
          </div>

          {/* Center: Info */}
          <div className="flex flex-col items-center text-center gap-1">
            <p
              className="text-sm font-medium"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              © {new Date().getFullYear()} GuambraWeb
            </p>
            <p
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Riobamba, Chimborazo, Ecuador 🇪🇨
            </p>
          </div>

          {/* Right: Legal Links */}
          <div className="flex justify-center md:justify-end">
            <LegalFooterLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
