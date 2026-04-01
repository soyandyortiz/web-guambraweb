import Link from "next/link";
import { GuambraLogo, GuambraIcon } from "./GuambraLogo";

export function FooterLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center hover:opacity-85 transition-opacity">
      <GuambraLogo size="sm" />
    </Link>
  );
}

/** Versión icono cuadrado (para el sidebar colapsado) */
export function SidebarIcon() {
  return <GuambraIcon className="h-9 w-auto" />;
}
