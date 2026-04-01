"use client";

import { useEffect, useState, useRef } from "react";

const CODE_SNIPPETS = [
  "const web = createSystem({",
  "  location: 'Riobamba',",
  "  performance: '100',",
  "  seo: true",
  "});",
  "function optimize(process) {",
  "  return process.faster();",
  "}",
  "<GuambraWeb commerce={true} />",
  "import { AI } from 'guambra';",
  "git commit -m 'Vision -> Reality'",
  "npm install success",
  "const pricing = { value: 'best' };",
  "await solution.deploy();",
  "for (let i = 0; i < ∞; i++) {",
  "  innovation.push(new Idea());",
  "}",
  "system.vitals.check('100%');",
  "// Automating Riobamba...",
  "export default function Future() {",
  "  return <Success />;",
  "}",
  "database.save(clientVision);",
  "apiKey: 'sb_pub_guambra_XyZ'",
  "if (mode === 'beast') accelerate();",
  "const [growth, setGrowth] = useState(0);",
  "useEffect(() => grow(), [vision]);",
  "styles.premium.apply(everything);",
  "console.log('Building Ecuador...');",
];

export function CodingAnimation() {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => {
        const nextLine = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        const newLines = [...prev, nextLine];
        return newLines.length > 15 ? newLines.slice(1) : newLines;
      });
    }, 1200);

    // Solo rastrear el mouse en desktop
    if (window.matchMedia("(pointer: fine)").matches) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        clearInterval(interval);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col gap-1.5 font-mono text-[9px] md:text-xs opacity-40 select-none pointer-events-none transition-transform duration-500 ease-out will-change-transform"
    >
      <div className="flex gap-1.5 mb-2">
         <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
         <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
         <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
      </div>
      {lines.map((line, i) => (
        <div 
          key={i + line} 
          className="animate-in fade-in slide-in-from-left-4 duration-700 whitespace-nowrap overflow-hidden"
          style={{ 
            color: i === lines.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            opacity: 1 - (lines.length - 1 - i) * 0.1,
            paddingLeft: `${Math.sin(i * 0.5) * 5 + 5}px`
          }}
        >
          <span className="mr-2 opacity-30">{(i + 1).toString().padStart(2, '0')}</span>
          <span className="mr-2 opacity-50 text-primary">{">"}</span>
          {line}
        </div>
      ))}
    </div>
  );
}
