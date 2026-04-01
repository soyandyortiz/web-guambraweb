"use client";

import { getFullProformaData } from "./proforma-actions";
import { exportToPDF } from "@/lib/pdf-utils";

/**
 * Función única y reutilizable para descargar una Proforma en PDF.
 * @param surfaceId ID del elemento DOM que contiene la previsualización
 * @param filename Nombre del archivo PDF a generar
 */
export async function handleDownloadPDF(
  surfaceId: string = "document-a4-surface",
  filename: string = "Proforma_GuambraWeb.pdf"
) {
  try {
    const element = document.getElementById(surfaceId);
    
    if (!element) {
      console.warn(`Elemento ${surfaceId} no encontrado. Asegúrate de que la previsualización esté abierta.`);
      return { success: false, error: "Previsualización no encontrada" };
    }

    // Esperar un momento para asegurar que el DOM (especialmente si es oculto) esté listo
    await new Promise(resolve => setTimeout(resolve, 150));

    const success = await exportToPDF(surfaceId, filename);
    return { success };
  } catch (error) {
    console.error("Error en handleDownloadPDF:", error);
    return { success: false, error: "Error al generar el PDF" };
  }
}
