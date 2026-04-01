"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { ProformaCentrada } from "@/components/admin/shared/ProformaCentrada";
import { exportToPDF } from "@/lib/pdf-utils";
import { getFullProformaData } from "@/app/admin/ventas/proformas/proforma-actions";
import { handleDownloadPDF } from "@/app/admin/ventas/proformas/proforma-client-utils";

interface PDFDownloadButtonProps {
  proformaId: string;
  documentNumber: string;
  variant?: "icon" | "full";
}

/**
 * PDFDownloadButton
 * Handles fetching data, showing a preview modal, and exporting to high-quality PDF.
 */
export function PDFDownloadButton({ proformaId, documentNumber, variant = "icon" }: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [docData, setDocData] = useState<any>(null);

  const staticSurfaceId = `static-pdf-${proformaId.substring(0, 8)}`;

  const handleDirectDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      console.log("Iniciando descarga directa de proforma:", proformaId);
      
      // 1. Obtener datos si no los tenemos
      let currentData = docData;
      if (!currentData) {
        currentData = await getFullProformaData(proformaId);
        if (!currentData) {
          alert("No se pudo cargar la información de la proforma.");
          setLoading(false);
          return;
        }
        setDocData(currentData);
      }

      // 2. Definir nombre de archivo: Proforma_GuambraWeb_[ID].pdf
      const filename = `Proforma_GuambraWeb_${documentNumber.replace(/\//g, "-")}.pdf`;

      // 3. Pequeña espera para asegurar que el componente oculto se renderice con los datos
      // handleDownloadPDF ya tiene un delay interno de 150ms, pero aseguramos el ciclo de vida de React
      setTimeout(async () => {
        const result = await handleDownloadPDF(staticSurfaceId, filename);
        if (!result.success) {
          alert(result.error || "Error al generar el archivo PDF.");
        }
        setLoading(false);
      }, 100);

    } catch (err) {
      console.error("Error en descarga directa:", err);
      alert("Error al procesar la descarga.");
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleDirectDownload}
        disabled={loading}
        className={variant === "full" ? "btn-secondary gap-2" : "p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"}
        title="Descargar PDF Directamente"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : (variant === "full" ? <><Download size={18} /> Descargar Proforma</> : <Download size={16} />)}
      </button>

      {/* Renderizado en segundo plano (Invisible) para captura de PDF */}
      {docData && (
        <div 
          style={{ 
            position: "absolute", 
            left: "-9999px", 
            top: "0", 
            opacity: 0, 
            pointerEvents: "none",
            zIndex: -1
          }}
        >
          <ProformaCentrada {...docData} surfaceId={staticSurfaceId} />
        </div>
      )}
    </>
  );
}
