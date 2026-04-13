"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
};

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const initial: Record<string, React.CSSProperties> = {
    "fade-up": { opacity: 0, transform: "translateY(28px)" },
    "fade-in": { opacity: 0, transform: "none" },
    "fade-left": { opacity: 0, transform: "translateX(-24px)" },
    "fade-right": { opacity: 0, transform: "translateX(24px)" },
  };

  const final: React.CSSProperties = { opacity: 1, transform: "none" };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "opacity 0.55s ease, transform 0.55s ease",
        ...(visible ? final : initial[animation]),
      }}
    >
      {children}
    </div>
  );
}
