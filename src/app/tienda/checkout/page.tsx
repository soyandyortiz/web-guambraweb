import { createClient } from "@/lib/supabase/server";
import CheckoutFlow from "./CheckoutFlow";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Finalizar Compra | GuambraWeb",
  description: "Procesa y finaliza tu compra de servicios y productos digitales de GuambraWeb de manera segura.",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let customer = null;
  if (user) {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("profile_id", user.id)
      .single();
    customer = data;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 lg:py-24">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8" style={{ color: "hsl(var(--foreground))" }}>
        Finalizar <span className="gradient-text">Compra</span>
      </h1>
      
      {/* El flujo del cliente toma el estado de la sesión */}
      <Suspense fallback={<div className="py-20 text-center">Cargando flujo de compra...</div>}>
        <CheckoutFlow initialUser={user ? { id: user.id, email: user.email || "" } : null} initialCustomer={customer} />
      </Suspense>
    </div>
  );
}
