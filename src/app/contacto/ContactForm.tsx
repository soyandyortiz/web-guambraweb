"use client";

import { Send } from "lucide-react";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    
    const text = `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`;
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/593982650929?text=${encodedText}`;
    
    window.open(url, "_blank");
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-bold"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Nombre Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ej. Juan Pérez"
          className="w-full px-5 py-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-bold"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="tu@email.com"
          className="w-full px-5 py-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-bold"
          style={{ color: "hsl(var(--foreground))" }}
        >
          ¿En qué podemos ayudarte?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Cuéntanos brevemente sobre tu proyecto o duda..."
          className="w-full px-5 py-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full btn-primary py-4 text-lg rounded-xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-transform shadow-lg hover:shadow-primary/30"
      >
        <Send size={20} />
        Enviar Mensaje
      </button>
    </form>
  );
}
