"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { ProformaCentrada } from "@/components/admin/shared/ProformaCentrada";
import { exportToPDF } from "@/lib/pdf-utils";

/**
 * InvoicePDFButton - Botón que toma datos ya cargados y genera un comprobante PDF en segundo plano.
 * No requiere re-fetechear datos ya que se le pasan por props.
 */
interface InvoicePDFButtonProps {
  factura: {
    id: string;
    number: string;
    date: string;
    clientData: {
      name: string;
      taxId: string;
      email: string;
      address?: string;
    };
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    discount?: number;
  };
}

export function InvoicePDFButton({ factura }: InvoicePDFButtonProps) {
  const [loading, setLoading] = useState(false);
  const staticSurfaceId = `static-invoice-${factura.id.substring(0, 8)}`;

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Pequeño retardo para asegurar que el componente oculto se monte/actualice
      await new Promise(resolve => setTimeout(resolve, 500));

      const fileName = `Comprobante_GuambraWeb_${factura.number.replace(/\//g, "-")}.pdf`;
      
      const success = await exportToPDF(staticSurfaceId, fileName);

      if (!success) {
        throw new Error("PDF export failed");
      }

    } catch (err) {
      console.error("Error al generar comprobante PDF:", err);
      alert("No se pudo generar el PDF del comprobante.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleDownload}
        disabled={loading}
        className="btn-primary btn-sm flex items-center gap-2"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
        Descargar Comprobante
      </button>

      {/* RENDER INVISIBLE PARA CAPTURA */}
      <div 
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          top: "0", 
          opacity: 0, 
          pointerEvents: "none",
          zIndex: -1
        }}
        aria-hidden="true"
      >
        <ProformaCentrada 
          type="COMPROBANTE"
          number={factura.number}
          date={factura.date}
          clientData={factura.clientData}
          items={factura.items}
          surfaceId={staticSurfaceId}
          customSubtotal={factura.subtotal}
          customTax={factura.tax}
          customTotal={factura.total}
          discount={factura.discount}
        />
      </div>
    </>
  );
}
