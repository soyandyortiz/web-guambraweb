"use client";

import { useCart } from "@/components/providers/CartProvider";
import { X, Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    cart,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-[101] h-full w-full max-w-md flex flex-col shadow-2xl transition-transform transform translate-x-0"
        style={{ background: "hsl(var(--card))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-foreground">Tu Carrito</h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-24">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <ShoppingCart size={48} className="mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ¡Anímate a explorar nuestros productos!
              </p>
              <button
                onClick={closeDrawer}
                className="mt-6 btn-primary w-full max-w-[200px]"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-4 group">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border bg-muted/30">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingCart size={24} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500/70 hover:text-red-500 p-1 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden h-8">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-full px-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-zinc-900 dark:text-zinc-100 h-full flex items-center justify-center bg-white/60 dark:bg-zinc-900/40">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-full px-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 w-full p-5 bg-card/95 backdrop-blur border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Subtotal</span>
              <span className="text-xl font-bold text-foreground">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/tienda/carrito"
                onClick={closeDrawer}
                className="btn-primary w-full justify-center flex items-center shadow-lg"
              >
                Ir a pagar
              </Link>
              <button
                onClick={closeDrawer}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors text-center"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
