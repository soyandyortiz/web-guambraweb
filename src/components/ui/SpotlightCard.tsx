"use client";

import React, { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string; // e.g. "hsl(var(--primary))"
}

export function SpotlightCard({ 
  children, 
  className = "", 
  color = "hsl(var(--primary))" 
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Batch DOM Reads
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Batch DOM Writes using requestAnimationFrame to prevent Forced Synchronous Layout
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    });
  };

  const handleMouseEnter = () => {
    if (layerRef.current) layerRef.current.style.opacity = "1";
  };
  const handleMouseLeave = () => {
    if (layerRef.current) layerRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{ "--spotlight-color": color } as React.CSSProperties}
    >
      <div ref={layerRef} className="spotlight-layer" style={{ opacity: 0 }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export function TextGlow({ 
  children, 
  className = "", 
  color = "hsl(var(--primary))" 
}: { 
  children: React.ReactNode; 
  className?: string; 
  color?: string;
}) {
  return (
    <span 
      className={`text-glow-wrapper ${className}`}
      style={{ "--spotlight-color": color } as React.CSSProperties}
    >
      <span className="text-glow-bg" />
      <span className="relative z-10">{children}</span>
    </span>
  );
}


