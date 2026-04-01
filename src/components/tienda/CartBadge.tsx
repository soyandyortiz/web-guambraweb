"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useEffect, useState } from "react";

export function CartBadge() {
  const { totalItems, openDrawer } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button 
      onClick={openDrawer} 
      className="btn-primary btn-sm relative flex items-center gap-2"
    >
      <ShoppingCart size={14} />
      <span>Carrito</span>
      {mounted && totalItems > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
          {totalItems}
        </div>
      )}
    </button>
  );
}
