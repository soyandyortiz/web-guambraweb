"use client";

import { useState, useEffect } from "react";
import { X, FileText, Shield, Printer } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   DATOS LEGALES — GuambraWeb
   Titular: Andy Javier Ortiz Valdiviezo · C.I. 0604511089
   Contacto: guambraweb@gmail.com
   Última actualización: febrero 2026
──────────────────────────────────────────────────────────────── */

const LEGAL = {
  updated: "24 de febrero de 2026",
  business: "GuambraWeb",
  owner: "Andy Javier Ortiz Valdiviezo",
  id: "0604511089",
  email: "guambraweb@gmail.com",
  location: "Riobamba, Chimborazo, Ecuador",
};

/* ── Contenido: Términos y Condiciones ── */
function TerminosContent() {
  return (
    <div className="legal-body space-y-6 text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        Última actualización: {LEGAL.updated}
      </p>

      <p>
        Los presentes Términos y Condiciones regulan el uso del sitio web y la tienda en línea de{" "}
        <strong>{LEGAL.business}</strong>, operada por{" "}
        <strong>{LEGAL.owner}</strong> (C.I. {LEGAL.id}), con sede en{" "}
        {LEGAL.location}. Al navegar y realizar compras en nuestra plataforma, el
        usuario acepta de forma expresa e inequívoca todos los términos aquí
        descritos.
      </p>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          1. Naturaleza de los servicios
        </h3>
        <p>
          {LEGAL.business} ofrece servicios digitales profesionales que incluyen,
          sin limitarse a: desarrollo web, diseño de tiendas en línea, sistemas de
          gestión empresarial, consultoría tecnológica y productos digitales
          autogestionables. Todos los servicios son de carácter intangible y se
          entregan de forma digital.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          2. Proceso de compra y pago
        </h3>
        <p>
          Las transacciones en nuestra tienda en línea se procesan de forma segura
          a través de pasarelas de pago certificadas y transferencias bancarias directas.
          GuambraWeb no almacena datos de tarjetas de crédito ni débito.
        </p>
        <p className="mt-2">
          El pago se considera confirmado únicamente cuando se valida el comprobante de
          transferencia o la pasarela emite una notificación de transacción exitosa.
          Hasta ese momento, el pedido permanece en estado <em>pendiente de pago</em>.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          3. Política de no reembolso
        </h3>
        <p>
          Dado el carácter intangible y personalizado de los servicios de
          {LEGAL.business}, <strong>no se realizan reembolsos monetarios</strong>{" "}
          una vez que el pago ha sido procesado y confirmado exitosamente.
        </p>
        <p className="mt-2">
          No obstante, si por alguna razón justificada el cliente no puede hacer
          uso del servicio adquirido, el valor pagado{" "}
          <strong>quedará acreditado como saldo a favor</strong> en su cuenta de la
          tienda en línea de GuambraWeb, sin fecha de vencimiento, y podrá ser
          utilizado en cualquier compra futura dentro de nuestra plataforma.
        </p>
        <p className="mt-2">
          Para solicitar la acreditación de saldo, el cliente debe comunicarse por
          correo electrónico a{" "}
          <a href={`mailto:${LEGAL.email}`} className="underline" style={{ color: "hsl(var(--primary))" }}>
            {LEGAL.email}
          </a>{" "}
          dentro de los <strong>30 días calendario</strong> siguientes a la fecha
          de compra, indicando el número de pedido y motivo de la solicitud.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          4. Cancelaciones y modificaciones de servicio
        </h3>
        <p>
          Cualquier solicitud de cancelación o modificación de un servicio contratado
          deberá realizarse antes de que se haya iniciado su ejecución. Una vez
          iniciado el desarrollo o entrega, aplica la política de no reembolso
          descrita en la cláusula 3. GuambraWeb se reserva el derecho de rechazar
          o cancelar una solicitud de servicio si determina que no cumple con sus
          estándares operativos, en cuyo caso se emitirá un crédito total a favor
          del cliente.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          5. Propiedad del Código y Alojamiento
        </h3>
        <p>
          Los productos y sistemas adquiridos en <strong>{LEGAL.business}</strong> son desarrollados bajo la metodología de "Código Puro" (Pure Code) y optimizados para nuestra infraestructura. Por esta razón:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Titularidad:</strong> GuambraWeb conserva la propiedad intelectual del código fuente base y la estructura del sistema, otorgando al cliente una licencia de uso perpetua sobre el producto final.</li>
          <li><strong>Alojamiento:</strong> Para mantener los costos de adquisición más competitivos del mercado ecuatoriano, los proyectos se alojan en nuestros sistemas supervisados.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          6. Entrega de Proyecto y Código Fuente
        </h3>
        <p>
          Si el cliente desea obtener la propiedad total del código fuente y migrar el sistema a una infraestructura externa e independiente, podrá solicitar la <strong>Transferencia de Proyecto</strong>.
        </p>
        <p className="mt-2 text-primary font-bold">
          Este servicio tiene un costo administrativo único de $99.00 USD.
        </p>
        <p className="mt-2 italic">
          Tras el pago y la entrega del código, GuambraWeb cesará toda responsabilidad sobre el mantenimiento, seguridad, backups y supervisión técnica del sistema.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          7. Limitación de responsabilidad
        </h3>
        <p>
          {LEGAL.business} no será responsable por daños indirectos, lucro
          cesante, pérdida de datos ni cualquier otro perjuicio derivado del uso o
          imposibilidad de uso de los servicios contratados, salvo que dichos daños
          sean consecuencia directa de negligencia grave o dolo de {LEGAL.business}.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          7. Ley aplicable y jurisdicción
        </h3>
        <p>
          Estos términos se rigen por las leyes de la República del Ecuador. Para
          cualquier controversia derivada de los presentes términos, las partes se
          someten a los tribunales competentes de la ciudad de Riobamba, provincia
          de Chimborazo, Ecuador.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          8. Contacto
        </h3>
        <p>
          Para consultas sobre estos términos, escríbenos a:{" "}
          <a href={`mailto:${LEGAL.email}`} className="underline font-semibold" style={{ color: "hsl(var(--primary))" }}>
            {LEGAL.email}
          </a>
        </p>
      </section>
    </div>
  );
}

/* ── Contenido: Política de Privacidad ── */
function PrivacidadContent() {
  return (
    <div className="legal-body space-y-6 text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        Última actualización: {LEGAL.updated}
      </p>

      <p>
        En <strong>{LEGAL.business}</strong>, operada por{" "}
        <strong>{LEGAL.owner}</strong> (C.I. {LEGAL.id}), con sede en{" "}
        {LEGAL.location}, nos comprometemos a proteger la privacidad y los datos
        personales de nuestros usuarios. Este documento describe cómo recopilamos,
        usamos y protegemos su información conforme a la{" "}
        <em>Ley Orgánica de Protección de Datos Personales del Ecuador</em>.
      </p>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          1. Datos que recopilamos
        </h3>
        <p>Al utilizar nuestra tienda en línea y servicios, podemos recopilar los siguientes datos:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Datos de identificación:</strong> Nombre completo o razón social, cédula de identidad o RUC.</li>
          <li><strong>Datos de contacto:</strong> Correo electrónico, teléfono.</li>
          <li><strong>Datos de facturación:</strong> Dirección, provincia, ciudad, país.</li>
          <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas (mediante cookies esenciales).</li>
          <li><strong>Datos de transacción:</strong> Historial de pedidos y montos. <em>No almacenamos datos bancarios ni de tarjetas.</em></li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          2. Finalidad del tratamiento
        </h3>
        <p>Sus datos son utilizados para:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Procesar y gestionar sus pedidos y pagos.</li>
          <li>Emitir documentos de facturación o comprobantes fiscales.</li>
          <li>Brindar soporte técnico y atención al cliente.</li>
          <li>Enviar comunicaciones relacionadas con sus pedidos (nunca publicidad no solicitada sin consentimiento previo).</li>
          <li>Cumplir con obligaciones legales y regulatorias aplicables en Ecuador.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          3. Procesamiento de pagos
        </h3>
        <p>
          Los pagos pueden ser procesados mediante transferencia bancaria directa 
          o plataformas de pago de terceros certificadas. GuambraWeb{" "}
          <strong>no tiene acceso ni almacena</strong> datos de tarjetas de crédito,
          débito ni credenciales bancarias sensibles. Los datos proporcionados 
          para transferencias se utilizan exclusivamente para la validación del pago.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          4. Base de datos y seguridad
        </h3>
        <p>
          Los datos son almacenados en servidores seguros de{" "}
          <strong>Supabase</strong> (infraestructura en la nube con cifrado en
          reposo y en tránsito). Implementamos medidas técnicas y organizativas para
          proteger su información contra acceso no autorizado, pérdida o destrucción.
          Solo el personal autorizado de {LEGAL.business} tiene acceso a los datos
          personales, estrictamente para las finalidades descritas.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          5. Derechos del titular
        </h3>
        <p>
          Conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador,
          usted tiene derecho a:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Acceso:</strong> Conocer qué datos suyos tenemos.</li>
          <li><strong>Rectificación:</strong> Corregir datos incorrectos o incompletos.</li>
          <li><strong>Eliminación:</strong> Solicitar la supresión de sus datos (sujeto a obligaciones legales).</li>
          <li><strong>Oposición:</strong> Oponerse al tratamiento para fines de marketing.</li>
          <li><strong>Portabilidad:</strong> Recibir sus datos en formato legible y transferible.</li>
        </ul>
        <p className="mt-2">
          Puede ejercer estos derechos escribiendo a{" "}
          <a href={`mailto:${LEGAL.email}`} className="underline font-semibold" style={{ color: "hsl(var(--primary))" }}>
            {LEGAL.email}
          </a>.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          6. Cookies
        </h3>
        <p>
          Utilizamos únicamente cookies esenciales para el funcionamiento del sitio
          (autenticación, carrito de compras). No utilizamos cookies de rastreo
          publicitario de terceros.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          7. Retención de datos
        </h3>
        <p>
          Conservamos sus datos personales mientras sea necesario para prestar los
          servicios contratados o cumplir con obligaciones legales aplicables. Puede
          solicitar la eliminación de sus datos en cualquier momento, salvo que
          exista una obligación legal que lo impida.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          8. Modificaciones a esta política
        </h3>
        <p>
          {LEGAL.business} se reserva el derecho de actualizar esta política en
          cualquier momento. Se notificará a los usuarios mediante aviso en el sitio
          web sobre los cambios significativos.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--primary))" }}>
          9. Contacto del Responsable
        </h3>
        <p>
          Responsable: <strong>{LEGAL.owner}</strong> (C.I. {LEGAL.id})<br />
          Correo:{" "}
          <a href={`mailto:${LEGAL.email}`} className="underline font-semibold" style={{ color: "hsl(var(--primary))" }}>
            {LEGAL.email}
          </a><br />
          Ubicación: {LEGAL.location}
        </p>
      </section>
    </div>
  );
}

/* ── Modal wrapper ── */
export type ModalType = "terminos" | "privacidad" | null;

export function LegalModal({
  type,
  onClose,
}: {
  type: ModalType;
  onClose: () => void;
}) {
  if (!type) return null;

  const isTerminos = type === "terminos";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print styles — only the modal content prints */}
      <style>{`
        @media print {
          /* Reset common elements that might interfere */
          html, body {
            background: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Hide everything except the print-root component */
          body > :not(#legal-print-root) {
            display: none !important;
          }

          #legal-print-root {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            z-index: auto !important;
          }

          /* Hide interactive elements of the modal */
          .no-print { 
            display: none !important; 
          }

          /* Show the header designed for print */
          .print-header {
            display: block !important;
          }

          .legal-modal-inner {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            transform: none !important;
          }

          /* Ensure all nested scroll areas expand */
          .overflow-y-auto {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }

          /* Formatting the text for print */
          .legal-body {
            color: #000 !important;
            background: transparent !important;
            font-family: serif !important;
            font-size: 11pt !important;
            line-height: 1.5 !important;
            text-align: justify !important;
          }

          .legal-body strong, 
          .legal-body b,
          .legal-body h3 {
            font-weight: bold !important;
            color: #000 !important;
          }

          .legal-body h3 {
            font-size: 14pt !important;
            margin-top: 1.5em !important;
            margin-bottom: 0.5em !important;
            border-bottom: 1pt solid #000 !important;
            padding-bottom: 3pt !important;
          }

          .legal-body p {
            margin-bottom: 1em !important;
          }

          .legal-body a {
            text-decoration: none !important;
            color: #000 !important;
          }

          @page {
            margin: 2.5cm;
            size: A4;
          }
        }
      `}</style>

      <div
        id="legal-print-root"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 no-scrollbar"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="legal-modal-inner relative w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            maxHeight: "88vh",
          }}
        >
          {/* Header */}
          <div
            className="no-print flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "hsl(var(--primary) / 0.12)",
                  color: "hsl(var(--primary))",
                }}
              >
                {isTerminos ? <FileText size={18} /> : <Shield size={18} />}
              </div>
              <div>
                <h2 className="font-bold text-base leading-tight" style={{ color: "hsl(var(--foreground))" }}>
                  {isTerminos ? "Términos y Condiciones" : "Política de Privacidad"}
                </h2>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  GuambraWeb · {LEGAL.updated}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                title="Imprimir / Guardar como PDF"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--primary) / 0.2)",
                }}
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Imprimir / PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "hsl(var(--muted-foreground))" }}
                title="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Print header (only visible on print) */}
          <div className="print-header hidden px-6 pt-10 text-center">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">
              {isTerminos ? "Términos y Condiciones" : "Política de Privacidad"} — {LEGAL.business}
            </h1>
            <p className="text-sm border-b pb-6 mb-8" style={{ borderColor: '#000' }}>
              Titular: {LEGAL.owner} · C.I. {LEGAL.id} · {LEGAL.email} · {LEGAL.updated}
            </p>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto px-6 py-5 flex-1">
            {isTerminos ? <TerminosContent /> : <PrivacidadContent />}
          </div>

          {/* Footer */}
          <div
            className="no-print px-6 py-4 border-t flex-shrink-0 text-center"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {LEGAL.business} · {LEGAL.owner} · C.I. {LEGAL.id} ·{" "}
              <a href={`mailto:${LEGAL.email}`} className="underline" style={{ color: "hsl(var(--primary))" }}>
                {LEGAL.email}
              </a>{" "}
              · {LEGAL.location}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Botones del footer ── Exportados para usar en cualquier footer ── */
export function LegalFooterLinks() {
  const [modal, setModal] = useState<ModalType>(null);

  // Exponer función global para abrir modales legales desde cualquier parte (ej: checkout)
  useEffect(() => {
    (window as any).openLegalModal = (type: ModalType) => setModal(type);
    return () => { (window as any).openLegalModal = undefined; };
  }, []);

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={() => setModal("terminos")}
          className="text-xs font-medium underline-offset-2 hover:underline transition-colors"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Términos y Condiciones
        </button>
        <span style={{ color: "hsl(var(--border))" }}>·</span>
        <button
          onClick={() => setModal("privacidad")}
          className="text-xs font-medium underline-offset-2 hover:underline transition-colors"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Política de Privacidad
        </button>
      </div>

      <LegalModal type={modal} onClose={() => setModal(null)} />
    </>
  );
}
