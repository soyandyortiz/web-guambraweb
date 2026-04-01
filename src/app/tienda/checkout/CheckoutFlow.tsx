"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/providers/CartProvider";
import Link from "next/link";
import { saveCustomerData, processCheckout, validateCoupon } from "./actions";
import { ArrowLeft, CheckCircle2, AlertCircle, Building2, Bitcoin, Smartphone, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlanById } from "@/app/actions/subscription-plans";
import CopyButton from "@/components/ui/CopyButton";

// Formatos iniciales de Props
interface CheckoutFlowProps {
  initialUser: { id: string; email: string } | null;
  initialCustomer: any | null;
}

export default function CheckoutFlow({
  initialUser,
  initialCustomer,
}: CheckoutFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan_id");
  const [months, setMonths] = useState(parseInt(searchParams.get("months") || "24"));
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const supabase = createClient();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(!!planId);

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"customer" | "confirm" | "success"> (
    initialUser && initialCustomer ? "confirm" : "customer",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data consolidada para finalizar checkout
  const [userId, setUserId] = useState<string | null>(initialUser?.id || null);
  const [customerId, setCustomerId] = useState<string | null>(
    initialCustomer?.id || null,
  );

  // Estados de Cupón
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    discount_percent: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isSubscription = !!planId && !!selectedPlan;

  // Lógica de precios Hostinger adaptada
  const getPricingDetails = (basePrice: number, m: number) => {
    let multiplier = 1;
    let renewalMultiplier = 1;

    if (m === 12) {
      multiplier = 0.4;
      renewalMultiplier = 0.87;
    } else if (m === 24) {
      multiplier = 0.27;
      renewalMultiplier = 0.83;
    } else if (m === 6) {
      multiplier = 0.73;
      renewalMultiplier = 0.87;
    }

    const monthlyPrice = basePrice * multiplier;
    const renewalPrice = basePrice * renewalMultiplier;
    
    return {
      monthly: monthlyPrice,
      total: monthlyPrice * m,
      regularMonthly: basePrice,
      regularTotal: basePrice * m,
      renewal: renewalPrice,
      savings: (basePrice * m) - (monthlyPrice * m)
    };
  };

  const pricingDetails = selectedPlan ? getPricingDetails(selectedPlan.price_monthly, months) : null;

  // Precio para suscripción considerando el intervalo
  const getSubscriptionBasePrice = () => {
    if (!pricingDetails) return 0;
    return pricingDetails.total;
  };

  // Cálculos de descuento sobre el precio efectivo
  const subscriptionPrice = getSubscriptionBasePrice();
  const effectiveBasePrice = isSubscription ? subscriptionPrice : totalPrice;
  const effectiveItems = isSubscription ? 1 : totalItems;

  const discountAmount = appliedCoupon
    ? (effectiveBasePrice * appliedCoupon.discount_percent) / 100
    : 0;
  const finalTotal = effectiveBasePrice - discountAmount;

  // Carrito efectivo para el checkout
  const effectiveCart = isSubscription
    ? [
        {
          id: selectedPlan.id,
          name: `${selectedPlan.name} (Suscripción ${months} ${months === 1 ? "Mes" : "Meses"})`,
          price: subscriptionPrice,
          image_url: null,
          quantity: 1,
        },
      ]
    : cart;

  // Ubicaciones Ecuador
  const ECUADOR_LOCATIONS: Record<string, string[]> = {
    Azuay: ["Cuenca", "Gualaceo", "Paute", "Sigsig", "Girón", "Otro"],
    Bolívar: ["Guaranda", "San Miguel", "Chimbo", "Otro"],
    Cañar: ["Azogues", "La Troncal", "Cañar", "Biblián", "Otro"],
    Carchi: ["Tulcán", "San Gabriel", "El Ángel", "Mira", "Otro"],
    Chimborazo: ["Riobamba", "Guano", "Alausí", "Chambo", "Otro"],
    Cotopaxi: ["Latacunga", "Pujilí", "Salcedo", "Saquisilí", "Otro"],
    "El Oro": [
      "Machala",
      "Pasaje",
      "Santa Rosa",
      "Huaquillas",
      "El Guabo",
      "Otro",
    ],
    Esmeraldas: ["Esmeraldas", "Quinindé", "Atacames", "Muisne", "Otro"],
    Galápagos: [
      "Puerto Baquerizo Moreno",
      "Puerto Ayora",
      "Puerto Villamil",
      "Otro",
    ],
    Guayas: [
      "Guayaquil",
      "Durán",
      "Milagro",
      "Samborondón",
      "Daule",
      "Playas",
      "Otro",
    ],
    Imbabura: ["Ibarra", "Otavalo", "Atuntaqui", "Cotacachi", "Otro"],
    Loja: ["Loja", "Catamayo", "Macará", "Cariamanga", "Otro"],
    "Los Ríos": [
      "Babahoyo",
      "Quevedo",
      "Buena Fe",
      "Ventanas",
      "Vinces",
      "Otro",
    ],
    Manabí: [
      "Portoviejo",
      "Manta",
      "Chone",
      "El Carmen",
      "Bahía de Caráquez",
      "Otro",
    ],
    "Morona Santiago": ["Macas", "Sucúa", "Gualaquiza", "Otro"],
    Napo: ["Tena", "Archidona", "El Chaco", "Otro"],
    Orellana: [
      "Puerto Francisco de Orellana (Coca)",
      "Joya de los Sachas",
      "Otro",
    ],
    Pastaza: ["Puyo", "Mera", "Arajuno", "Otro"],
    Pichincha: [
      "Quito",
      "Cayambe",
      "Machachi",
      "Sangolquí",
      "Tabacundo",
      "Otro",
    ],
    "Santa Elena": ["Santa Elena", "La Libertad", "Salinas", "Otro"],
    "Santo Domingo de los Tsáchilas": ["Santo Domingo", "La Concordia", "Otro"],
    Sucumbíos: ["Nueva Loja", "Shushufindi", "Cuyabeno", "Otro"],
    Tungurahua: ["Ambato", "Baños", "Pelileo", "Píllaro", "Otro"],
    "Zamora Chinchipe": ["Zamora", "Yantzaza", "Otro"],
  };

  // Estados Formulario de Cliente (Facturación)
  const [tipoDocumento, setTipoDocumento] = useState("Cédula");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombreFacturacion, setNombreFacturacion] = useState("");
  const [emailFacturacion, setEmailFacturacion] = useState(
    initialUser?.email || "",
  );
  const [telefono, setTelefono] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [manualPaymentMethod, setManualPaymentMethod] = useState<
    "transferencia_bancaria" | "bitcoin" | "deuna"
  >("deuna");

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<{
    id: string;
    shortId: string;
    total: number;
    productNames: string;
    method: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (planId) {
      setPlanLoading(true);
      getPlanById(planId)
        .then((p) => {
          setSelectedPlan(p);
          setPlanLoading(false);
        })
        .catch((err) => {
          console.error("Error loading plan:", err);
          setError("No se pudo cargar el plan seleccionado.");
          setPlanLoading(false);
        });
    }
  }, [planId]);

  if (!mounted) return null;

  if (planLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando detalles del plan...</p>
      </div>
    );
  }

  // Prevenir acceso si el carrito está vacío en pasos previos a "success" (y si no se está mostrando el modal de pago)
  if (effectiveCart.length === 0 && step !== "success" && !showPaymentModal) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">
          No tienes nada en tu carrito
        </h2>
        <Link href="/tienda" className="btn-primary">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  // ==== HANDLERS ====

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validaciones Especiales de Documento
    const numericRegex = /^[0-9]+$/;
    if (!numericRegex.test(numeroDocumento)) {
      setError("El número de documento solo debe contener números.");
      setLoading(false);
      return;
    }

    if (tipoDocumento === "Cédula" && numeroDocumento.length !== 10) {
      setError("La Cédula debe tener exactamente 10 dígitos numéricos.");
      setLoading(false);
      return;
    }

    if (tipoDocumento === "RUC" && numeroDocumento.length !== 13) {
      setError("El RUC debe tener exactamente 13 dígitos numéricos.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const fullName =
      user?.user_metadata?.full_name ||
      nombreFacturacion ||
      "Cliente Sin Nombre";
    const email = emailFacturacion.trim();

    const res = await saveCustomerData(
      userId,
      email,
      fullName,
      tipoDocumento,
      numeroDocumento,
      nombreFacturacion,
      telefono,
      province,
      city,
      address,
    );

    if (!res.success || !res.customer) {
      setError(res.message || "Hubo un error inesperado al guardar los datos.");
      setLoading(false);
      return;
    }

    setCustomerId(res.customer.id);
    setLoading(false);
    setStep("confirm");
  };

  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponMessage(null);

    const res = await validateCoupon(couponCode);

    if (res.success && res.coupon) {
      setAppliedCoupon({
        id: res.coupon.id,
        code: res.coupon.code,
        discount_percent: res.coupon.discount_percent || 0,
      });
      setCouponMessage({ type: "success", text: res.message });
    } else {
      setCouponMessage({ type: "error", text: res.message });
    }
    setCouponLoading(false);
  };

  const submitOrder = async () => {
    setLoading(true);
    setError(null);

    if (!customerId) {
      setError("Faltan datos de facturación.");
      setLoading(false);
      return;
    }

    const { success, message, orderId, reference, amount } =
      await processCheckout(
        effectiveCart as any,
        customerId,
        effectiveBasePrice,
        finalTotal,
        appliedCoupon?.id,
        discountAmount,
        isSubscription ? "subscription" : "product",
        undefined, // projectId se maneja después o es opcional aquí
        isSubscription
          ? {
              plan_id: planId,
              plan_name: selectedPlan.name,
              monthly_fee: selectedPlan.price_monthly,
              interval_months: months,
              total_months_paid: months,
            }
          : {},
        manualPaymentMethod,
        termsAccepted,
      );

    if (!success) {
      setError(message || "Error al generar pedido.");
      setLoading(false);
      return;
    }

    const productNames = effectiveCart
      .map((item: any) => `${item.name} (x${item.quantity})`)
      .join(", ");

    setCreatedOrderData({
      id: orderId!,
      shortId: orderId!.substring(0, 8).toUpperCase(),
      total: finalTotal,
      productNames: productNames || (isSubscription ? selectedPlan?.name : "Productos varios"),
      method: manualPaymentMethod,
    });

    clearCart();
    setLoading(false);
    setStep("success");
    setShowPaymentModal(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* SECCIÓN IZQUIERDA: FLUJO (LogIn -> Customer -> Confirmación) */}
      <div className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-4 rounded-xl flex gap-3 items-center">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* PASO 1. CUSTOMER */}
        {step === "customer" && (
          <form
            onSubmit={handleCustomerSubmit}
            className="card p-8 bg-card border shadow-sm"
          >
            <h2 className="text-xl font-bold mb-6">Datos de Facturación</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-xs font-medium mb-1 block">
                    Tipo de documento *
                  </label>
                  <select
                    required
                    className="input w-full appearance-none bg-background shadow-sm"
                    value={tipoDocumento}
                    onChange={(e) => {
                      setTipoDocumento(e.target.value);
                      setNumeroDocumento("");
                    }}
                  >
                    <option value="Cédula">Cédula</option>
                    <option value="RUC">RUC</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium mb-1 block">
                    Número de documento *
                  </label>
                  <input
                    required
                    placeholder={
                      tipoDocumento === "Cédula"
                        ? "10 dígitos numéricos"
                        : "13 dígitos numéricos"
                    }
                    className="input w-full"
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                    maxLength={tipoDocumento === "Cédula" ? 10 : 13}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">
                  Nombre completo o Razón social *
                </label>
                <input
                  required
                  placeholder="Ej: Juan Pérez / Empresa S.A."
                  className="input w-full"
                  value={nombreFacturacion}
                  onChange={(e) => setNombreFacturacion(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">
                  Correo electrónico *
                </label>
                <input
                  required
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="input w-full"
                  value={emailFacturacion}
                  onChange={(e) => setEmailFacturacion(e.target.value)}
                  readOnly={!!initialUser?.email}
                  title={
                    initialUser?.email
                      ? "El correo está vinculado a tu cuenta"
                      : ""
                  }
                  style={
                    initialUser?.email
                      ? { opacity: 0.7, cursor: "not-allowed" }
                      : {}
                  }
                />
                {initialUser?.email && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Correo vinculado a tu cuenta
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">
                  Teléfono de contacto *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+593 99 999 9999"
                  className="input w-full"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1 block">
                    Provincia *
                  </label>
                  <select
                    required
                    className="input w-full appearance-none bg-background shadow-sm"
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setCity(""); // Reset city when province changes
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecciona una provincia
                    </option>
                    {Object.keys(ECUADOR_LOCATIONS)
                      .sort()
                      .map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">
                    Ciudad *
                  </label>
                  <select
                    required
                    className="input w-full appearance-none bg-background shadow-sm disabled:opacity-50"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!province}
                  >
                    <option value="" disabled hidden>
                      Selecciona una ciudad
                    </option>
                    {province &&
                      ECUADOR_LOCATIONS[province].sort().map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">
                  Dirección Principal *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Calle principal, intersección, número de casa/oficina, referencia"
                  className="input w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary mt-8 py-3 text-sm"
            >
              {loading ? "Guardando..." : "Guardar y Continuar al Resumen"}
            </button>
          </form>
        )}

        {/* PASO 2 Y 3. CONFIRMACIÓN, PAGO, PROCESSING, SUCCESS */}
        {step === "confirm" && (
          <div className="card p-8 bg-card border shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-center">Selecciona tu Método de Pago</h2>
            
            <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Acepto los <button type="button" onClick={() => (window as any).openLegalModal?.("terminos")} className="text-primary font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">Términos y Condiciones</button> y la <button type="button" onClick={() => (window as any).openLegalModal?.("privacidad")} className="text-primary font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">Política de Privacidad</button>.
                </span>
              </label>
            </div>

            <div className={`py-2 text-left transition-all duration-300 ${!termsAccepted ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              {!termsAccepted && (
                 <p className="text-[10px] text-warning font-bold uppercase tracking-wider mb-4 animate-pulse">
                   ⚠️ Debes aceptar los términos para continuar
                 </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { 
                    id: "deuna", 
                    label: "DeUna!", 
                    sub: "Código QR Escaneable",
                    icon: <Smartphone className="text-primary" size={24} />
                  },
                  { 
                    id: "transferencia_bancaria", 
                    label: "Banco Pichincha", 
                    sub: "Directo Andy J. Ortiz",
                    icon: <Building2 className="text-primary" size={24} />
                  },
                  { 
                    id: "bitcoin", 
                    label: "Bitcoin (BTC)", 
                    sub: "On-chain / Lightning",
                    icon: <Bitcoin className="text-yellow-500" size={24} />
                  }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => {
                        setManualPaymentMethod(m.id as any);
                        submitOrder();
                    }}
                    disabled={loading}
                    className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-center group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-background border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      {m.icon}
                    </div>
                    <p className="font-bold text-base mb-1">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">{m.sub}</p>
                  </button>
                ))}
                
                <div className="sm:col-span-1 flex items-center">
                    <p className="text-xs text-muted-foreground p-4 italic text-center w-full">
                        Haz clic en cualquiera de las opciones para generar tu pedido y ver los datos de pago al instante.
                    </p>
                </div>
              </div>

              <div className="border border-white/5 bg-white/[0.02] rounded-[2rem] p-6 mb-8 text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                   Al generar el pedido, tendrás 2 horas para enviar tu comprobante a través de WhatsApp. Tu servicio se activará inmediatamente después de la validación.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="card p-12 bg-card border shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white">¡Gracias por tu compra!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Tu pedido ha sido registrado correctamente. Por favor completa el pago siguiendo las instrucciones del modal.
            </p>
            {!showPaymentModal && (
               <button 
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary px-8 py-3"
               >
                Ver instrucciones de pago
               </button>
            )}
            <div className="pt-8 border-t flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/tienda" className="btn-secondary px-8">Explorar más productos</Link>
            </div>
          </div>
        )}

        {step !== "success" && (
          <Link
            href="/tienda/carrito"
            className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors mt-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Editar articulos del carrito
          </Link>
        )}
      </div>

      {/* SECCIÓN DERECHA: RESUMEN DEL CARRITO (Excluyendo success state) */}
      {step !== "success" && (
        <div className="lg:pl-8 lg:border-l">
          <div className="sticky top-24 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-bold mb-6">
              Resumen de Compra ({effectiveItems})
            </h3>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {isSubscription ? (
                <div className="space-y-6">
                  {/* Period Selector (Hostinger style) */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Seleccionar Periodo</label>
                    <div className="flex flex-col gap-2">
                      {[1, 6, 12, 24].map((m) => {
                        const p = getPricingDetails(selectedPlan.price_monthly, m);
                        const isSelected = months === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMonths(m)}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              isSelected 
                              ? 'bg-primary/5 border-primary shadow-sm' 
                              : 'bg-card border-border hover:border-primary/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground/30'}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <div className="text-left">
                                <p className={`text-sm font-bold ${isSelected ? 'text-primary' : ''}`}>
                                  {m === 1 ? '1 mes' : `${m} meses`}
                                </p>
                                {m > 1 && (
                                  <p className="text-[10px] text-muted-foreground uppercase font-black">Ahorra {((1 - (p.monthly/p.regularMonthly)) * 100).toFixed(0)}%</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">${p.monthly.toFixed(2)}/mes</p>
                              {m > 1 && (
                                <p className="text-[10px] text-muted-foreground line-through">${p.regularMonthly.toFixed(2)}/mes</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing Context Details */}
                  {pricingDetails && months > 1 && (
                    <div className="p-4 rounded-2xl bg-[#bceb16]/10 border border-[#bceb16]/30 space-y-2">
                       <div className="flex items-center justify-between">
                         <span className="px-3 py-1 rounded-full bg-[#bceb16] text-black text-[10px] font-black uppercase tracking-wider shadow-sm">AHORRA ${(pricingDetails.savings).toFixed(2)}</span>
                       </div>
                       <p className="text-[11px] text-[#bceb16] font-bold">
                         Se renueva a ${pricingDetails.renewal.toFixed(2)}/mes tras el periodo inicial. Cancela cuando quieras.
                       </p>
                    </div>
                  )}
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 text-sm pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="font-bold line-clamp-2 leading-tight">
                        {item.name}
                      </p>
                      <div className="flex justify-between items-center text-muted-foreground mt-1">
                        <span>Cant: {item.quantity}</span>
                        <span className="font-bold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cupón de Descuento */}
            <div className="mt-6 pt-6 border-t">
              <label className="text-xs font-medium mb-2 block">
                ¿Tienes un cupón de descuento?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código de cupón"
                  className="input flex-1 uppercase text-sm"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={appliedCoupon !== null || loading}
                />
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  disabled={
                    couponLoading ||
                    !couponCode ||
                    appliedCoupon !== null ||
                    loading
                  }
                  className="btn-primary py-2 px-4 text-xs whitespace-nowrap h-[42px]"
                >
                  {couponLoading ? "Validando..." : "Validar"}
                </button>
              </div>
              {couponMessage && (
                <p
                  className={`text-xs mt-2 font-medium ${couponMessage.type === "success" ? "text-green-500" : "text-red-500"}`}
                >
                  {couponMessage.text}
                </p>
              )}
              {appliedCoupon && !loading && (
                <button
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponCode("");
                    setCouponMessage(null);
                  }}
                  className="text-[10px] text-muted-foreground underline mt-1 hover:text-foreground transition-colors"
                >
                  Remover cupón
                </button>
              )}
            </div>

            <div className="border-t mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${effectiveBasePrice.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Descuento ({appliedCoupon.discount_percent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between items-end">
                <span className="font-bold text-lg">Monto Total</span>
                <span className="text-3xl font-bold gradient-text">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAGO MANUAL */}
      {showPaymentModal && createdOrderData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 selection:bg-primary/30">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-white/[0.03] border-b border-white/5 p-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                  <CheckCircle2 className="text-green-500" size={28} />
                  ¡Pedido Recibido!
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-[0.2em] font-black">Instrucciones de Activación</p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* ID & Total */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-black/40 border border-white/5 rounded-3xl p-6 text-center shadow-inner">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1 text-xs">Monto Total</p>
                    <p className="text-3xl font-black text-primary font-display">${createdOrderData.total.toFixed(2)}</p>
                 </div>
                 <div className="bg-black/40 border border-white/5 rounded-3xl p-6 text-center shadow-inner">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1 text-xs">ID del Pedido</p>
                    <p className="text-3xl font-mono font-black text-white">#{createdOrderData.shortId}</p>
                 </div>
              </div>

              {/* Metodo de Pago Selector (Tabs) */}
              <div className="flex flex-wrap p-1.5 bg-white/[0.03] border border-white/5 rounded-3xl gap-1">
                {[
                  { id: "deuna", label: "DeUna!", icon: <Smartphone size={14} /> },
                  { id: "transferencia_bancaria", label: "Pichincha", icon: <Building2 size={14} /> },
                  { id: "bitcoin", label: "Bitcoin", icon: <Bitcoin size={14} /> }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setManualPaymentMethod(t.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      manualPaymentMethod === t.id 
                      ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                      : 'text-neutral-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Instructions Section */}
              <div className="space-y-6">
                {manualPaymentMethod === "transferencia_bancaria" && (
                  <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h4 className="font-bold flex items-center gap-3 text-primary text-lg">
                            <Building2 size={22} />
                            Banco Pichincha
                        </h4>
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">Ahorro Transaccional</span>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                        <span className="text-neutral-500 uppercase text-[10px] font-bold">Nombre Titular</span>
                        <span className="font-bold text-white uppercase tracking-tight">Andy Javier Ortiz</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                        <span className="text-neutral-500 uppercase text-[10px] font-bold">Número de Cuenta</span>
                        <div className="flex items-center gap-3">
                           <span className="font-mono font-black text-white text-base">2207862136</span>
                           <CopyButton value="2207862136" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-neutral-500 uppercase text-[10px] font-bold">Cédula / RUC</span>
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-white text-base">0604511089</span>
                           <CopyButton value="0604511089" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {manualPaymentMethod === "bitcoin" && (
                  <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                     <h4 className="font-bold flex items-center gap-3 text-yellow-500 border-b border-white/5 pb-4 text-lg">
                      <Bitcoin size={22} />
                      Bitcoin (On-chain / Lightning)
                    </h4>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-40 h-40 bg-white p-3 rounded-2xl flex-shrink-0 shadow-xl shadow-yellow-500/10 group rotate-1 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                         <img src="/bitcoin_qr.png" alt="Bitcoin QR" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-4">
                         <p className="text-xs text-neutral-400 leading-relaxed font-medium">Escanea el código QR o copia la siguiente dirección para transferir los fondos.</p>
                         <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Wallet Address</span>
                                <CopyButton value="BC1QKVR0DZGPGLSFQYTQK5XWLQZVZV9RFSQSDT3PF7" />
                            </div>
                            <code className="block text-[10px] font-mono break-all text-neutral-200 bg-neutral-900/50 p-2 rounded-lg leading-loose">
                                BC1QKVR0DZGPGLSFQYTQK5XWLQZVZV9RFSQSDT3PF7
                            </code>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {manualPaymentMethod === "deuna" && (
                  <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                     <h4 className="font-bold flex items-center gap-3 text-primary border-b border-white/5 pb-4 text-lg">
                      <Smartphone size={22} />
                      Pago rápido con DeUna!
                    </h4>
                    <div className="flex flex-col md:flex-row gap-10 items-center justify-center py-4">
                      <div className="w-44 h-44 bg-white p-3 rounded-[2.5rem] flex-shrink-0 shadow-2xl shadow-primary/20 animate-pulse-slow overflow-hidden">
                         <img src="/deuna_qr.png" alt="DeUna QR" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-4 text-center md:text-left">
                         <p className="text-xl font-black italic tracking-tighter text-white uppercase">Andy Javier Ortiz</p>
                         <p className="text-sm text-neutral-400 font-medium leading-relaxed">Escanea el QR arriba desde tu aplicación DeUna! y envía el monto de <b>${createdOrderData.total.toFixed(2)}</b>.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Steps */}
              <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                      <CheckCircle2 size={120} />
                  </div>
                  <h5 className="text-[10px] uppercase font-black text-neutral-500 tracking-[0.3em] mb-6">Próximos Pasos</h5>
                  <div className="space-y-6 relative z-10">
                    {[
                      "Deposita o transfiere el monto indicado.",
                      "Envía el comprobante pulsando el botón verde.",
                      "Activaremos tu servicio tras la validación manual."
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0 border border-primary/20">{i+1}</span>
                        <p className="text-sm text-neutral-300 font-medium leading-tight pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white/[0.03] border-t border-white/5 space-y-4">
              <a 
                href={`https://wa.me/593982650929?text=${encodeURIComponent(
                  `💲 *Hola GuambraWeb!*\n\n` +
                  `He realizado un nuevo pedido y adjunto los detalles:\n\n` +
                  `🆔 *Orden:* #${createdOrderData.shortId}\n` +
                  `📦 *Productos:* ${createdOrderData.productNames}\n` +
                  `💰 *Monto Total:* $${createdOrderData.total.toFixed(2)}\n` +
                  `💳 *Método Elegido:* ${manualPaymentMethod === 'transferencia_bancaria' ? 'Banco Pichincha' : manualPaymentMethod === 'bitcoin' ? 'Bitcoin' : 'DeUna!'}\n\n` +
                  `Adjunto el comprobante de pago para su validación. 🚀`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] shadow-2xl shadow-green-600/30 text-lg group"
              >
                <Smartphone size={24} className="group-hover:scale-110 transition-transform" />
                Confirmar por WhatsApp
              </a>
              <p className="text-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                Tu solicitud ya está registrada en nuestro sistema
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
