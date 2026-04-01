"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Code2, Cpu, Globe, Layers, Layout, 
  MessageSquare, Rocket, Shield, Terminal, 
  Zap, ShoppingBag, CreditCard, Package
} from "lucide-react";

type AnimationType = 'nodes' | 'icons' | 'binary' | 'ecommerce';

interface DecorativeAnimationProps {
  type: AnimationType;
  className?: string;
  count?: number;
}

export function DecorativeAnimation({ type, className = "", count = 6 }: DecorativeAnimationProps) {
  const [elements, setElements] = useState<any[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize random elements
    const newElements = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 20 + 20,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      drift: { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 }
    }));
    setElements(newElements);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [count]);

  if (type === 'binary') {
    return (
      <div className={`absolute inset-0 overflow-hidden opacity-10 pointer-events-none select-none font-mono text-[10px] sm:text-xs ${className}`}>
        <div className="flex flex-wrap gap-4 justify-around w-full h-full p-10 animate-pulse-glow">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {Array.from({ length: 15 }).map((_, j) => (
                <span key={j} style={{ opacity: Math.random() }}>
                  {Math.round(Math.random())}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getIcon = (i: number) => {
    const icons = type === 'ecommerce' 
      ? [ShoppingBag, CreditCard, Package, Zap, Globe, Layers]
      : [Code2, Terminal, Cpu, Globe, Shield, Rocket];
    const Icon = icons[i % icons.length];
    return <Icon size={elements[i]?.size} />;
  };

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px) scale(1.1)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {elements.map((el, i) => (
        <div
          key={el.id}
          className="absolute opacity-[0.08] dark:opacity-[0.12] transition-colors duration-500 animate-pulse"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            color: 'hsl(var(--primary))',
            animation: `pulseGlow ${el.duration}s infinite ${el.delay}s`,
            transform: `translate(${mousePos.x * (i % 2 === 0 ? 1 : -1) * 0.2}px, ${mousePos.y * (i % 2 === 0 ? -1 : 1) * 0.2}px)`,
          }}
        >
          {getIcon(i)}
        </div>
      ))}
      
      {type === 'nodes' && (
         <svg className="absolute inset-0 w-full h-full opacity-[0.05]" style={{ transform: `scale(1.2) translate(${-mousePos.x}px, ${-mousePos.y}px)` }}>
            <circle cx="20%" cy="30%" r="2" fill="currentColor" />
            <circle cx="80%" cy="20%" r="2" fill="currentColor" />
            <circle cx="70%" cy="80%" r="2" fill="currentColor" />
            <circle cx="10%" cy="70%" r="2" fill="currentColor" />
            <line x1="20%" y1="30%" x2="80%" y2="20%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="80%" y1="20%" x2="70%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="70%" y1="80%" x2="10%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="10%" y1="70%" x2="20%" y2="30%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
         </svg>
      )}
    </div>
  );
}
