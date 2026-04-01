"use client";

import { useEffect } from "react";

/** Registra una visita real al cargar la página — dispara solo una vez por visita. */
export function VisitTracker() {
  useEffect(() => {
    fetch("/api/bio/track-visit", { method: "POST" }).catch(() => {});
  }, []); // [] → una sola vez, después de hidratación

  return null;
}
