import { updateSession } from "./lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 1. Manejo del subdominio sistema.guambraweb.com
  if (host === "sistema.guambraweb.com") {
    if (url.pathname === "/") {
      const newUrl = new URL("/admin", request.url);
      return NextResponse.rewrite(newUrl);
    }
  }

  // 2. Manejo del subdominio bio.guambraweb.com → /links
  if (host === "bio.guambraweb.com") {
    const newUrl = new URL("/links", request.url);
    return NextResponse.rewrite(newUrl);
  }

  // 3. Ejecutar lógica de Supabase (refresh de sesión y redirecciones de seguridad)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
