import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CheckCircle2, Building2, Bitcoin, Smartphone, MessageSquare, ArrowRight, ShieldCheck, Clock, FileText, Hash } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import CopyButton from "@/components/ui/CopyButton";

export const metadata: Metadata = {
  title: "Confirmación de Pago | GuambraWeb",
  description: "Instrucciones paso a paso para completar tu pago manual de forma segura.",
};

async function getOrder(orderId: string) {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, customers(company_name, email, telefono), order_items(*, products(name))")
    .eq("id", orderId)
    .single();

  if (error || !order) return null;
  return order;
}

export default async function ConfirmacionPagoPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  const shortId = orderId.substring(0, 8).toUpperCase();
  const total = order.total_amount;
  const method = order.metodo_pago_manual || "transferencia_bancaria";

  // Construir detalles del producto para WhatsApp
  const productDetails = (order.order_items as any[])
    ?.map((item: any) => `${item.products?.name} (x${item.quantity})`)
    .join(", ") || "Productos varios";

  const whatsappMessage = `Hola Guambra web, he adquirido el siguiente producto: ${productDetails}. La orden del pedido es: #${shortId} ($${total.toFixed(2)}).`;
  const whatsappUrl = `https://wa.me/593984187654?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 py-12 md:py-24 px-6 selection:bg-primary/30">
      {/* Fondo Decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full opacity-10">
          <div className="bg-primary/20 blur-[120px] w-[600px] h-[600px] rounded-full absolute -top-40 -left-40 animate-pulse"></div>
          <div className="bg-blue-500/10 blur-[100px] w-[500px] h-[500px] rounded-full absolute bottom-0 right-0 animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header de Éxito */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-green-500/10 border border-green-500/20 mb-8 animate-in zoom-in duration-700">
            <CheckCircle2 size={56} className="text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            ¡Tu pedido está <span className="gradient-text">recibido</span>!
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
            Hemos registrado tu solicitud correctamente. Completa el pago a continuación para comenzar a trabajar en tu proyecto.
          </p>
        </div>

        {/* Resumen de Pedido Estilo Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Número de Pedido", value: `#${shortId}`, color: "text-white" },
            { label: "Total a Pagar", value: `$${total.toFixed(2)}`, color: "text-primary" },
            { label: "Estado del Pago", value: "Pendiente", color: "text-yellow-500" },
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl text-center">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-500 mb-2">{item.label}</p>
              <p className={`text-2xl font-black ${item.color} font-mono`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Columna Principal: Datos de Pago */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="border-b border-white/5 bg-white/[0.02] px-8 py-6 flex items-center justify-between">
                <h2 className="font-bold text-lg flex items-center gap-3">
                  {method === "transferencia_bancaria" && <Building2 size={24} className="text-primary" />}
                  {method === "bitcoin" && <Bitcoin size={24} className="text-primary" />}
                  {method === "deuna" && <Smartphone size={24} className="text-primary" />}
                  Datos de Pago
                </h2>
                <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Seguro</span>
                </div>
              </div>

              <div className="p-8 flex-1">
                {method === "transferencia_bancaria" && (
                  <div className="space-y-6">
                    <p className="text-sm text-neutral-400">
                      Realiza una transferencia interbancaria o depósito directo con los siguientes datos:
                    </p>
                    <div className="space-y-4 bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-xs text-neutral-500 uppercase font-medium">Banco</span>
                        <span className="font-bold text-white">Banco de Pichincha</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-xs text-neutral-500 uppercase font-medium">Nombre Titular</span>
                        <span className="font-bold text-white uppercase">Andy Ortiz Valdiviezo</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-xs text-neutral-500 uppercase font-medium">Tipo de Cuenta</span>
                        <span className="font-bold text-white">Ahorros</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-xs text-neutral-500 uppercase font-medium">Nro. de Cuenta</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">2207862136</span>
                          <CopyButton value="2207862136" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-xs text-neutral-500 uppercase font-medium">Cédula / RUC</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">1105315486</span>
                          <CopyButton value="1105315486" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {method === "bitcoin" && (
                  <div className="space-y-8 text-center md:text-left">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                       <div className="w-52 h-52 bg-white p-3 rounded-2xl flex-shrink-0 shadow-lg shadow-primary/10 group rotate-1 hover:rotate-0 transition-transform duration-500">
                        <img src="/bitcoin_qr.png" alt="Bitcoin QR" className="w-full h-full object-contain filter invert" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-2">
                          <Bitcoin size={14} className="text-yellow-500" />
                          <span className="text-[10px] font-bold uppercase text-yellow-500">Bitcoin Network / Lightning</span>
                        </div>
                        <p className="text-sm text-neutral-400">
                          Escanea el QR o copia la dirección de la billetera. Recibimos depósitos en ambas redes.
                        </p>
                        <div className="p-4 rounded-xl bg-black border border-white/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-neutral-500">Dirección BTC</span>
                            <CopyButton value="BC1QKVR0DZGPGLSFQYTQK5XWLQZVZV9RFSQSDT3PF7" />
                          </div>
                          <code className="block text-xs font-mono break-all text-white bg-neutral-900 p-2 rounded-lg border border-white/5">
                            BC1QKVR0DZGPGLSFQYTQK5XWLQZVZV9RFSQSDT3PF7
                          </code>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-500 italic p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      * El pago se confirma tras 2 validaciones en la red principal o inmediata vía Lightning. El monto en BTC se ajusta al valor de mercado del comprobante.
                    </p>
                  </div>
                )}

                {method === "deuna" && (
                  <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="w-56 h-56 bg-white p-4 rounded-[2.5rem] flex-shrink-0 shadow-2xl shadow-primary/20 animate-pulse-slow">
                      <img src="/deuna_qr.png" alt="DeUna QR" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 space-y-5">
                      <h3 className="text-xl font-bold italic tracking-tight text-white">¡Paga rápido con <span className="text-primary italic">DeUna!</span></h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        Escanea el código QR desde tu app para realizar el pago al instante sin costos de transacción.
                      </p>
                      <div className="space-y-3 bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Beneficiario</span>
                          <span className="font-bold text-white uppercase">Andy Ortiz V.</span>
                        </div>
                        <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                          <span className="text-neutral-500">Referencia</span>
                          <span className="font-bold text-primary italic">Pedido #{shortId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Lateral: Pasos a seguir */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-950/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 h-full">
              <h3 className="font-bold text-lg mb-8 flex items-center gap-3 text-white">
                <FileText size={20} className="text-primary" />
                Instrucciones
              </h3>
              
              <div className="space-y-8">
                {[
                  { icon: <Hash size={16} />, title: "Pedido Automático", desc: "Se ha generado el número de pedido #" + shortId + " de forma automática." },
                  { icon: <Building2 />, title: "Depositar Dinero", desc: "El siguiente paso es realizar el depósito o transferencia con los datos adjuntos." },
                  { icon: <MessageSquare />, title: "Contacto WhatsApp", desc: "Una vez realizado el depósito, pulsa el botón de WhatsApp para contactarnos." },
                  { icon: <ShieldCheck />, title: "Enviar Comprobante", desc: "Comparte tu número de pedido y el comprobante para la validación." },
                  { icon: <Clock />, title: "Validación Manual", desc: "Pasaremos de estado 'Pendiente de Pago' a 'Pagado' tras verificar tu transacción." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
                        {step.icon}
                      </div>
                      {i < 4 && <div className="w-px h-full bg-gradient-to-b from-primary/20 to-transparent my-1"></div>}
                    </div>
                    <div className="pt-1 pb-4">
                      <h4 className="font-bold text-sm text-neutral-200 mb-1">{i + 1}. {step.title}</h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-green-600/20"
                >
                  <MessageSquare size={20} />
                  Enviar Comprobante
                </a>
                <Link 
                  href="/tienda" 
                  className="w-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-medium py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowRight size={16} />
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
            <p className="text-neutral-500 text-sm mb-6">¿Necesitas ayuda inmediata?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">Soporte Chat Activo</span>
              </div>
              <div className="text-neutral-600 hidden sm:block">|</div>
              <p className="text-sm font-medium">guambraweb@gmail.com</p>
            </div>
        </div>
      </div>
    </div>
  );
}

