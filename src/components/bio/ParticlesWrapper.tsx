"use client";

import dynamic from "next/dynamic";

const ParticlesBackground = dynamic(
  () => import("./ParticlesBackground").then((m) => m.ParticlesBackground),
  { ssr: false }
);

export function ParticlesWrapper() {
  return <ParticlesBackground />;
}
