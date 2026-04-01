import React from "react";

/**
 * ProformaCentrada - Componente optimizado para exportación PDF con alineación central.
 * Diseñado para evitar errores de parseo de color (oklab/oklch) usando solo Hexadecimales.
 * Estética limpia, robusta y 100% compatible.
 */

interface DocumentItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface ProformaCentradaProps {
  type: "PROFORMA" | "FACTURA" | string;
  number: string;
  date: string;
  clientData: {
    name: string;
    taxId: string;
    email: string;
    address?: string;
  };
  items: DocumentItem[];
  surfaceId?: string;
  // Totales opcionales para forzar valores (útil en facturas con descuentos)
  customSubtotal?: number;
  customTax?: number;
  customTotal?: number;
  discount?: number;
  validityDays?: number;
  expiryDate?: string;
}

export const ProformaCentrada: React.FC<ProformaCentradaProps> = ({
  type,
  number,
  date,
  clientData,
  items,
  surfaceId = "pdf-centered-surface",
  customSubtotal,
  customTax,
  customTotal,
  discount,
  validityDays,
  expiryDate,
}) => {
  // Configuración de Colores Hexadecimales Puros
  const azulProfundo = "#002E5D";
  const cyanTecnologico = "#00E5FF";
  const blanco = "#FFFFFF";
  const negro = "#000000";
  const grisBorde = "#D1D5DB";
  const grisFila = "#F8FAFC";

  const subtotalCalculated = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0,
  );
  const subtotal = customSubtotal ?? subtotalCalculated;
  const taxableAmount = subtotal - (discount ?? 0);
  const tax = customTax ?? taxableAmount * 0; // 0% IVA (Régimen RIMPE)
  const total = customTotal ?? taxableAmount + tax;
  const isInvoice = type.toUpperCase() === "COMPROBANTE";

  return (
    <div
      id={surfaceId}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: blanco,
        color: negro,
        fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
        textAlign: "center",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        padding: "0", // Eliminamos el padding global para que el header sea full-width
      }}
    >
      {/* HEADER - CLEAN & COMPACT */}
      <header
        style={{
          backgroundColor: azulProfundo,
          padding: "25px 20px",
          color: blanco,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: "0",
            fontSize: "28px",
            fontWeight: "400",
            letterSpacing: "4px",
            color: blanco,
          }}
        >
          GUAMBRA<span style={{ fontWeight: "900" }}>WEB</span>
        </h1>
        <p
          style={{
            margin: "2px 0 10px 0",
            fontSize: "11px",
            letterSpacing: "2px",
            fontWeight: "bold",
            opacity: 0.9,
          }}
        >
          SOLUCIONES TECNOLÓGICAS
        </p>

        <div
          style={{ fontSize: "13px", margin: "0 0 2px 0", fontWeight: "bold" }}
        >
          RUC: 0604511089001 | Andy Ortiz Valdiviezo
        </div>
        <div style={{ fontSize: "11px", opacity: 0.8 }}>
          Riobamba, Ecuador | 0982650929 | guambraweb@gmail.com
        </div>
      </header>

      {/* CUERPO DEL DOCUMENTO */}
      <main style={{ padding: "20px 1cm", flex: 1 }}>
        {/* TÍTULO Y DATOS DEL DOCUMENTO */}
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "900",
              margin: "0 0 10px 0",
              color: azulProfundo,
            }}
          >
            {type.toUpperCase()}
          </h2>

          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: negro,
            }}
          >
            Número: <span style={{ fontFamily: "monospace" }}>{number}</span> -
            Fecha de Emisión: {date}
          </div>
          {expiryDate && !isInvoice && (
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: azulProfundo,
                fontStyle: "italic",
              }}
            >
              Válido hasta: {expiryDate}
            </div>
          )}
        </div>

        {/* ... (el resto del main se mantiene igual, pero con flex: 1) ... */}

        {/* INFORMACIÓN DEL CLIENTE CENTRADA */}
        <div
          style={{
            width: "90%",
            margin: "0 auto 20px auto",
            padding: "12px",
            border: `1px solid ${grisBorde}`,
            backgroundColor: grisFila,
          }}
        >
          <h3
            style={{
              fontSize: "10px",
              fontWeight: "900",
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "2px",
              margin: "0 0 10px 0",
            }}
          >
            Información del Cliente
          </h3>
          <div
            style={{
              color: "#000000",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            {clientData.name}
          </div>
          <div style={{ color: "#000000", fontSize: "14px" }}>
            ID/RUC: {clientData.taxId} | Email: {clientData.email}
          </div>
          {clientData.address && (
            <div
              style={{
                color: "#000000",
                fontSize: "12px",
                marginTop: "5px",
                fontStyle: "italic",
              }}
            >
              {clientData.address}
            </div>
          )}
        </div>

        <div
          style={{
            width: "100%",
            margin: "0 0 30px 0",
            border: `1px solid ${grisBorde}`,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: azulProfundo, color: blanco }}>
                <th
                  style={{
                    padding: "12px",
                    border: `1px solid ${grisBorde}`,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    textAlign: "left",
                  }}
                >
                  Descripción
                </th>
                <th
                  style={{
                    padding: "12px",
                    border: `1px solid ${grisBorde}`,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    width: "80px",
                    textAlign: "center",
                  }}
                >
                  Cant.
                </th>
                <th
                  style={{
                    padding: "12px",
                    border: `1px solid ${grisBorde}`,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    width: "110px",
                    textAlign: "right",
                  }}
                >
                  P. Unit
                </th>
                <th
                  style={{
                    padding: "12px",
                    border: `1px solid ${grisBorde}`,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    width: "130px",
                    textAlign: "right",
                  }}
                >
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    color: negro,
                    backgroundColor: idx % 2 === 1 ? grisFila : blanco,
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      border: `1px solid ${grisBorde}`,
                      fontSize: "12px",
                      textAlign: "left",
                      color: "#000000",
                    }}
                  >
                    {item.description}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: `1px solid ${grisBorde}`,
                      fontSize: "12px",
                      textAlign: "center",
                      color: "#000000",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: `1px solid ${grisBorde}`,
                      fontSize: "12px",
                      textAlign: "right",
                      color: "#000000",
                    }}
                  >
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: `1px solid ${grisBorde}`,
                      fontSize: "12px",
                      textAlign: "right",
                      color: "#000000",
                    }}
                  >
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BLOQUE DE TOTALES - ALINEACIÓN DERECHA */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
          }}
        >
          <div style={{ width: "240px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                color: "#000000",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              >
                SUBTOTAL
              </span>
              <span style={{ fontSize: "12px", color: "#000000" }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {!!(discount && discount > 0) && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    background: "#ECFDF5",
                    borderRadius: "4px",
                    margin: "4px 0",
                    color: "#059669",
                    border: "1px dashed #10B981",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: "900" }}>
                    AHORRO EXCLUSIVO
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "900" }}>
                    -${discount.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#059669",
                    textAlign: "right",
                    fontStyle: "italic",
                    marginBottom: "4px",
                  }}
                >
                  * Aplicado por tiempo limitado
                </div>
              </>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                color: "#000000",
              }}
            >
              <span style={{ fontSize: "11px", color: "#000000" }}>
                IVA (0%)
              </span>
              <span style={{ fontSize: "11px", color: "#000000" }}>
                ${tax.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                color: azulProfundo,
                borderTop: `1px solid ${grisBorde}`,
                marginTop: "4px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "900" }}>
                TOTAL FINAL
              </span>
              <span style={{ fontSize: "16px", fontWeight: "900" }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER - PEGADO AL FINAL */}
      <footer style={{ padding: "0 1cm 40px 1cm" }}>
        {/* MÉTODOS DE PAGO */}
        <div style={{ marginBottom: "25px", border: `1px solid ${grisBorde}`, borderRadius: "8px", padding: "15px", backgroundColor: "#F8FAFC" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "900",
              color: azulProfundo,
              textTransform: "uppercase",
              margin: "0 0 10px 0",
              textAlign: "center",
            }}
          >
            Métodos de Pago Aceptados
          </h4>
          <div style={{ display: "flex", justifyContent: "space-around", gap: "20px" }}>
            {/* Transferencia */}
            <div style={{ flex: 1, textAlign: "center", padding: "0 10px" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: azulProfundo, marginBottom: "4px" }}>Transferencia Bancaria</div>
              <div style={{ fontSize: "10px", color: "#000000", fontWeight: "bold" }}>Banco de Pichincha</div>
              <div style={{ fontSize: "10px", color: "#475569" }}>Cta. Ahorros: 2207862136</div>
              <div style={{ fontSize: "10px", color: "#475569" }}>Andy Ortiz Valdiviezo</div>
            </div>
            {/* Bitcoin */}
            <div style={{ flex: 1, textAlign: "center", borderLeft: `1px solid ${grisBorde}`, paddingLeft: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "#F59E0B", marginBottom: "4px" }}>Bitcoin (BTC)</div>
              <div style={{ fontSize: "9px", color: "#475569", wordBreak: "break-all", fontFamily: "monospace" }}>BC1QKVR0DZGPGLSFQYTQK5XWLQZVZV9RFSQSDT3PF7</div>
            </div>
          </div>
        </div>

        {/* TÉRMINOS Y CONDICIONES LEGALES */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h4
            style={{
              fontSize: "12px",
              fontWeight: "900",
              color: azulProfundo,
              textTransform: "uppercase",
              margin: "0 0 10px 0",
            }}
          >
            Términos y Condiciones
          </h4>

          <div
            style={{
              fontSize: "9px",
              color: "#475569",
              lineHeight: "1.4",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            {!isInvoice ? (
              <>
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>Validez:</strong> Esta proforma y sus beneficios
                  (incluyendo descuentos exclusivos) tienen una vigencia de{" "}
                  {validityDays || 15} días calendario.{" "}
                  {expiryDate ? `Oferta válida hasta el ${expiryDate}.` : ""} Pasado
                  este tiempo, el descuento no tendrá validez y los precios estarán
                  sujetos a cambios.
                </p>
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>Pagos:</strong> El inicio de cualquier proyecto
                  requiere el 50% de anticipo. El 50% restante se cancelará
                  contra entrega. No se realizarán
                  entregas finales o despliegues en producción sin la
                  cancelación total.
                </p>
              </>
            ) : (
              <p style={{ margin: "0 0 5px 0" }}>
                <strong>Comprobante Oficial:</strong> Este documento certifica
                la recepción del pago y la prestación de los servicios/productos
                detallados. Conservar este comprobante para cualquier trámite de
                garantía o soporte.
              </p>
            )}

            <p style={{ margin: "0 0 5px 0" }}>
              <strong>Soporte:</strong>{" "}
              {isInvoice ? "Soporte técnico activo" : "Incluye"} por 30 días
              post-lanzamiento para corrección de errores críticos. No incluye
              nuevas funcionalidades.
            </p>

            <div
              style={{
                marginTop: "15px",
                fontSize: "14px",
                fontWeight: "bold",
                color: azulProfundo,
              }}
            >
              {isInvoice
                ? "¡Gracias por su compra! Es un placer servirle con calidad digital."
                : '"Gracias por confiar en el talento digital de GuambraWeb"'}
            </div>
          </div>
        </div>

        {/* DIVIDER & BRANDING FOOTER */}
        <div
          style={{
            height: "1px",
            backgroundColor: cyanTecnologico,
            width: "100%",
            margin: "0 auto 15px auto",
          }}
        />
        <div
          style={{
            fontSize: "11px",
            color: "#64748B",
            letterSpacing: "1px",
            textAlign: "center",
          }}
        >
          Riobamba, Ecuador 2026 | www.guambraweb.com | Desarrollado por
          GuambraWeb
        </div>
      </footer>
    </div>
  );
};

export default ProformaCentrada;
