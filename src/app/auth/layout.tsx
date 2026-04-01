import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | GuambraWeb Admin",
  description: "Accede al panel de administración de GuambraWeb.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(at 30% 20%, hsl(var(--primary) / 0.15) 0px, transparent 50%), radial-gradient(at 80% 80%, hsl(var(--secondary) / 0.1) 0px, transparent 50%), hsl(var(--background))",
      }}
    >
      {children}
    </div>
  );
}
