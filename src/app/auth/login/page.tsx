"use client";

import { useState } from "react";
import { GuambraLogo } from "@/components/ui/GuambraLogo";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      className="card w-full max-w-md p-8 animate-scale-in"
      style={{
        boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px hsl(var(--border))",
      }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <GuambraLogo size="lg" />
        </div>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Panel de Administración
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm animate-fade-in"
            style={{
              background: "hsl(var(--destructive) / 0.1)",
              border: "1px solid hsl(var(--destructive) / 0.3)",
              color: "hsl(var(--destructive))",
            }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium block"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@guambraweb.com"
            className="input"
            required
            autoComplete="email"
          />
        </div>

        {/* Contraseña */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium block"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(var(--muted-foreground))" }}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full btn-lg"
          style={{ marginTop: "0.5rem" }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: "16px", height: "16px" }} />
              Ingresando...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Iniciar sesión
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="section-divider my-6" />

      {/* Footer del card */}
      <div className="text-center space-y-2">
        <div
          className="flex items-center justify-center gap-2 text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <Zap size={11} style={{ color: "hsl(var(--primary))" }} />
          Acceso restringido solo a administradores
        </div>
        <Link
          href="/"
          className="text-xs transition-colors"
          style={{ color: "hsl(var(--primary))" }}
        >
          ← Volver al sitio web
        </Link>
      </div>
    </div>
  );
}
