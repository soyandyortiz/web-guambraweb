"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
};

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    // Paleta más amplia con más brillo y variedad
    const palette = [
      { r: 67,  g: 97,  b: 238 },  // azul primario
      { r: 114, g: 9,   b: 183 },  // morado secundario
      { r: 100, g: 150, b: 255 },  // azul claro
      { r: 160, g: 90,  b: 240 },  // violeta claro
      { r: 0,   g: 200, b: 220 },  // cyan
      { r: 180, g: 60,  b: 255 },  // lila brillante
      { r: 50,  g: 120, b: 255 },  // azul medio
    ];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function spawn() {
      particles.length = 0;
      // ~3x más densidad que antes
      const count = Math.max(120, Math.floor((canvas!.width * canvas!.height) / 5000));
      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        const isStar = Math.random() < 0.12; // 12% son estrellas brillantes grandes
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * (isStar ? 0.3 : 0.65),
          vy: (Math.random() - 0.5) * (isStar ? 0.3 : 0.65),
          radius: isStar ? Math.random() * 3 + 2.5 : Math.random() * 2 + 0.6,
          r: c.r,
          g: c.g,
          b: c.b,
          alpha: isStar ? Math.random() * 0.5 + 0.4 : Math.random() * 0.45 + 0.15,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Líneas de conexión más visibles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;
          if (dist < maxDist) {
            const opacity = 0.18 * (1 - dist / maxDist);
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(100,130,255,${opacity})`;
            ctx!.lineWidth = 0.9;
            ctx!.stroke();
          }
        }
      }

      // Partículas con pulsación y halo
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < 0 || p.x > canvas!.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;

        const pulsedAlpha  = p.alpha + Math.sin(p.pulse) * 0.12;
        const pulsedRadius = p.radius + Math.sin(p.pulse) * 0.4;

        // Halo/glow para partículas grandes
        if (p.radius > 2) {
          const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedRadius * 3.5);
          grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${pulsedAlpha * 0.55})`);
          grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, pulsedRadius * 3.5, 0, Math.PI * 2);
          ctx!.fillStyle = grad;
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, Math.max(0.1, pulsedRadius), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.min(pulsedAlpha, 1)})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    const handleResize = () => {
      resize();
      spawn();
    };

    resize();
    spawn();
    draw();

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
