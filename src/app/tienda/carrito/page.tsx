"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useEffect, useState } from "react";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 lg:py-24 space-y-8">
      <Link
        href="/tienda"
        className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        <ArrowLeft size={16} />
        Seguir comprando
      </Link>

      <h1 className="text-3xl md:text-4xl font-display font-bold" style={{ color: "hsl(var(--foreground))" }}>
        Tu Carrito de <span className="gradient-text">Compras</span>
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <ShoppingBag size={64} className="mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>Tu carrito está vacío</h2>
          <p className="mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Aún no has agregado productos. Explora nuestra tienda para descubrir increíbles soluciones.
          </p>
          <Link href="/tienda" className="btn-primary">
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-card rounded-[2rem] border p-5 sm:p-8 shadow-sm" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: "hsl(var(--foreground))" }}>Productos en tu carrito</h2>
            
            <div className="flex flex-col divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-row items-center gap-4 py-5 transition-opacity"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center border" style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--muted))" }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag size={24} className="opacity-30" style={{ color: "hsl(var(--foreground))" }} />
                    )}
                  </div>

                  <div className="flex-grow text-left">
                    <h3 className="font-bold text-base sm:text-lg leading-tight mb-1" style={{ color: "hsl(var(--foreground))" }}>
                      {item.name}
                    </h3>
                    <div className="font-bold text-primary text-sm sm:text-base">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="flex items-center gap-1 border rounded-lg p-1 shadow-sm" style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 sm:px-3 sm:py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-2"
                      title="Eliminar producto"
                    >
                      <Trash2 size={18} />
                      <span className="hidden sm:inline font-bold">Quitar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div 
              className="rounded-2xl border p-6 lg:p-8 sticky top-24"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <h3 className="text-xl font-bold mb-6" style={{ color: "hsl(var(--foreground))" }}>Resumen del pedido</h3>
              
              <div className="space-y-4 mb-6 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (Iniciativa Local)</span>
                  <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>Calculado en check-out</span>
                </div>
              </div>

              <div className="border-t pt-6 mb-8" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex justify-between items-end">
                  <span className="font-bold" style={{ color: "hsl(var(--foreground))" }}>Total Estimado</span>
                  <span className="text-3xl font-bold gradient-text">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/tienda/checkout" className="w-full btn-primary py-4 text-center rounded-xl font-bold flex items-center justify-center">
                Proceder al pago
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
