"use client";

import React, { useEffect, useRef } from "react";

/**
 * Optimización: MouseGlow ahora usa manipulación directa de estilos mediante variables CSS
 * para evitar re-renderizados constantes de React en cada movimiento del mouse.
 */
export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No activar en dispositivos táctiles para ahorrar CPU y batería
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.setProperty("--x", `${e.clientX}px`);
      glowRef.current.style.setProperty("--y", `${e.clientY}px`);
      glowRef.current.style.setProperty("opacity", "0.18");
    };

    const handleMouseLeave = () => {
      if (!glowRef.current) return;
      glowRef.current.style.setProperty("opacity", "0");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0 transition-opacity duration-300"
      style={{
        background: "radial-gradient(circle 500px at var(--x, -500px) var(--y, -500px), hsl(var(--primary) / 0.15), transparent 70%)",
      }}
    />
  );
}

/**
 * Optimización: InteractiveGrid utiliza ahora un suavizado basado en CSS 
 * y se desactiva en móviles para mejorar la fluidez de desplazamiento.
 */
export function InteractiveGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      rafId = requestAnimationFrame(() => {
        if (!gridRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      ref={gridRef}
      className="fixed -inset-[50px] -z-10 overflow-hidden pointer-events-none will-change-transform"
      style={{
        transition: "transform 0.2s cubic-bezier(0.1, 0, 0.3, 1)",
      }}
    >
      {/* Grid Pattern — very subtle on light bg */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Mesh Blooms — soft blue/gray tints on white */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[140px] animate-pulse-glow"
           style={{ background: "hsl(214 100% 44% / 0.06)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full blur-[120px] animate-pulse-glow"
           style={{ background: "hsl(215 8% 43% / 0.05)", animationDelay: '1s' }} />
    </div>
  );
}
